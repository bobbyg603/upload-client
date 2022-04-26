import { Component } from '@angular/core';
import { faGithub, faMedium, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  faRocket = faRocket;
  faGithub = faGithub;
  faTwitter = faTwitter;
  faMedium = faMedium;
  faYoutube = faYoutube;
}
