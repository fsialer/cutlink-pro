import { Component } from '@angular/core';
import { NavBarSection } from '../../sections/landing/navbar/navbar';
import { HeroSection } from '../../sections/landing/hero/hero';
import { FeaturesSection } from '../../sections/landing/features/features';
import { FooterSection } from '../../sections/landing/footer/footer';

@Component({
  selector: 'app-landing-page',
  imports: [NavBarSection, HeroSection, FeaturesSection, FooterSection],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingPage {

}
