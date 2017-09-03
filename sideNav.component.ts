import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from './auth.service'; 
import { AppComponent } from './app.component';
@Component({
    moduleId: module.id,
    selector: 'sidenav',
    templateUrl: 'sideNav.component.html',
    styles: [`
        .error {
            background-color: #fff0f0
        }
    `]
})
export class SideNavComponent {}