const urlService = require('./url.service')
const repository = require('./url.repository')
const redisRepository = require('./redis.repository')
const producer = require('./click.producer')
const helper = require('../../helpers/helper');

jest.mock('./url.repository', () => ({
    createUrl: jest.fn(),
    getUrls: jest.fn(),
    getUrl: jest.fn(),
    updateUrl: jest.fn(),
    deleteUrl: jest.fn(),
    obtainUserIdByUrlId: jest.fn(),
    obtainUrlByShortCode: jest.fn(),
}));

jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => 'e43nn34')
}));


jest.mock('./redis.repository', () => ({
    increment: jest.fn(),
    get: jest.fn(),
    setNxEx: jest.fn(),
    expire: jest.fn()
}));

jest.mock('./click.producer', () => ({
    sendClick: jest.fn()
}));

jest.mock('../../helpers/helper', () => ({
    getValidUrl: jest.fn(),
    generateUniqueShortCode: jest.fn(),
    calculateExpiration: jest.fn(),
    enrichWithRealtimeStats: jest.fn()
}));



describe('[services / urlService]', () => {
    describe('#getPublicUrl', () => {
        it('should return url', async () => {
            //Arrange
            const shortCode = 'test'
            const fixedDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
            const url = {
                short_code: shortCode,
                long_url: 'https:example.com',
                owner_id: 1,
                clicks: 0,
                expires_at: fixedDate
            }
            repository.obtainUrlByShortCode.mockResolvedValueOnce(url)
            helper.getValidUrl.mockImplementationOnce(() => {
                return Promise.resolve()
            })
            //Act
            const result = await urlService.getPublicUrl(shortCode)
            //Assert
            expect(result).toEqual(url)
        })

        it('should throw error when URL not found', async () => {
            //Arrange
            const shortCode = 'non-existent'
            //Act & Assert
            repository.obtainUrlByShortCode.mockResolvedValueOnce(null)
            helper.getValidUrl.mockImplementationOnce(() => {
                return Promise.reject(new Error('URL not found'))
            })
            await expect(urlService.getPublicUrl(shortCode))
                .rejects.toThrow('URL not found')
        })

        it('shoul throw error when expire_at is in the past', async () => {
            //Arrange
            const shortCode = 'test'
            const pastDate = new Date();
            pastDate.setFullYear(pastDate.getFullYear() - 1);
            const fixedDate = pastDate.toISOString().slice(0, 19).replace('T', ' ')
            const url = {
                short_code: shortCode,
                long_url: 'https:example.com',
                owner_id: 1,
                clicks: 0,
                expires_at: fixedDate
            }
            repository.obtainUrlByShortCode.mockResolvedValueOnce(url)
            helper.getValidUrl.mockImplementationOnce(() => {
                return Promise.reject(new Error('URL has expired'))
            })
            //Act & Assert
            await expect(urlService.getPublicUrl(shortCode))
                .rejects.toThrow('URL has expired')
        })
    })

    describe("#getAllUrls", () => {
        it('should return All urls available for user', async () => {
            //Arrange
            const userId = 1
            const pastDate = new Date();
            pastDate.setFullYear(pastDate.getFullYear() - 1);
            const fixedDate = pastDate.toISOString().slice(0, 19).replace('T', ' ')
            const urls = [
                {
                    short_code: 'test',
                    long_url: 'https://example.com',
                    owner_id: userId,
                    clicks: 0,
                    expires_at: fixedDate
                }
            ]
            //Act
            repository.getUrls.mockResolvedValueOnce(urls);
            const result = await urlService.getAllUrls(userId);
            //Assert
            expect(result).toEqual(urls)
        })
    })

    describe("#createUrl", () => {
        it('should create new url', async () => {
            //Arrange
            const userId = 1
            const body = {
                long_url: 'https://example.com',
                expiration_hours: 24,
                owner_id: userId
            }
            const url = {
                short_code: 'e43nn34',
                long_url: 'https://example.com',
                owner_id: userId,
                clicks: 0,
                expires_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
            //Act
            repository.createUrl.mockResolvedValueOnce({ insertId: 1 })
            helper.generateUniqueShortCode.mockResolvedValueOnce(url.short_code)
            helper.calculateExpiration.mockResolvedValueOnce(url.expires_at)
            repository.obtainUrlByShortCode.mockResolvedValueOnce(url)
            const result = await urlService.createUrl(body)
            //Assert
            expect(result).toEqual({ short_code: url.short_code })
        })

        it('should throw error when short code already exists', async () => {
            //Arrange
            const userId = 1
            const body = {
                long_url: 'https://example.com',
                expiration_hours: 24,
                owner_id: userId
            }
            const url = {
                short_code: 'e43nn34',
                long_url: 'https://example.com',
                owner_id: userId,
                clicks: 0,
                expires_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
            //Act
            repository.createUrl.mockResolvedValueOnce({ insertId: 1 })
            helper.generateUniqueShortCode.mockResolvedValueOnce(url.short_code)
            helper.calculateExpiration.mockResolvedValueOnce(url.expires_at)
            repository.obtainUrlByShortCode.mockResolvedValueOnce(url)
            const result = await urlService.createUrl(body)
            //Assert
            expect(result).toEqual({ short_code: url.short_code })
        })

        it('should throw error when insert fail', async () => {
            //Arrange
            const userId = 1
            const body = {
                long_url: 'https://example.com',
                expiration_hours: 24,
                owner_id: userId
            }
            //Act
            repository.createUrl.mockResolvedValueOnce({ insertId: 0 })
            helper.generateUniqueShortCode.mockResolvedValueOnce('e43nn34')
            helper.calculateExpiration.mockResolvedValueOnce(new Date().toISOString())
            //Assert
            await expect(urlService.createUrl(body)).rejects.toThrow('URL not created')
        })

    })

    describe("#deleteUrl", () => {
        it('should delete url by id', async () => {
            //Arrange
            const urlId = 1
            const owner_id = 1
            //Act
            repository.getUrl.mockResolvedValueOnce({ url_id: urlId, owner_id })
            repository.deleteUrl.mockResolvedValueOnce(true)
            const result = await urlService.deleteUrl(urlId, owner_id)
            //Assert
            expect(result).toEqual(true)
        })

        it('should trow new error when url not found', async () => {
            //Arrange
            const urlId = 1
            const owner_id = 1
            //Act
            repository.getUrl.mockResolvedValueOnce(null)
            //Assert
            await expect(urlService.deleteUrl(urlId, owner_id)).rejects.toThrow('Unauthorized')
        })
    })

    describe("#incrementClick", () => {
        it('should increment click', async () => {
            //Arrange
            const short_code = 'test'
            const owner_id = 1
            const db_clicks = 0
            const clicks = 1
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const fixedDate = futureDate.toISOString().slice(0, 19).replace('T', ' ')

            //Act
            helper.getValidUrl.mockImplementationOnce(() => Promise.resolve())
            repository.obtainUrlByShortCode.mockResolvedValueOnce({ short_code, owner_id, clicks: db_clicks, expires_at: fixedDate })
            redisRepository.setNxEx.mockResolvedValueOnce(true)
            redisRepository.increment.mockResolvedValueOnce(clicks)
            redisRepository.expire.mockResolvedValueOnce(true)
            producer.sendClick.mockImplementationOnce(() => Promise.resolve())

            const result = await urlService.incrementClick(short_code, owner_id, db_clicks)
            //Assert
            expect(result).toEqual(clicks)
        })


        it('should throw error when url not found', async () => {
            //Arrange
            const short_code = 'test'
            const owner_id = 1
            const db_clicks = 0
            //Act
            helper.getValidUrl.mockImplementationOnce(() => {
                return Promise.reject(new Error('URL not found'))
            })
            repository.obtainUrlByShortCode.mockResolvedValueOnce(null)
            //Assert
            await expect(urlService.incrementClick(short_code, owner_id, db_clicks)).rejects.toThrow('URL not found')
        })

        it('should throw error when url is expired', async () => {
            //Arrange
            const short_code = 'test'
            const owner_id = 1
            const db_clicks = 0
            const pastDate = new Date();
            pastDate.setFullYear(pastDate.getFullYear() - 1);
            const fixedDate = pastDate.toISOString().slice(0, 19).replace('T', ' ')
            const url = {
                short_code,
                owner_id,
                clicks: db_clicks,
                expires_at: fixedDate
            }
            //Act
            helper.getValidUrl.mockImplementationOnce(() => {
                return Promise.reject(new Error('URL has expired'))
            })
            repository.obtainUrlByShortCode.mockResolvedValueOnce(url)
            //Assert
            await expect(urlService.incrementClick(short_code, owner_id, db_clicks)).rejects.toThrow('URL has expired')
        })
    })

})
