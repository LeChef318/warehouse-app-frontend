import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { UserProfile, UserUpdate } from '../../models/user.model';
import { KeycloakService } from '../../services/auth/keycloak.service';
import { ProfileEditFormComponent } from './profile-edit-form/profile-edit-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    ProfileEditFormComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private keycloakService = inject(KeycloakService);
  private snackBar = inject(MatSnackBar);

  profile: UserProfile | null = null;
  loading = true;
  error: string | null = null;
  isEditing = false;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.userService.getCurrentUser().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.error = 'Failed to load profile. Please try again.';
        this.loading = false;
      }
    });
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveProfile(update: UserUpdate): void {
    this.loading = true;
    this.userService.updateUser(update).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.isEditing = false;
        this.loading = false;
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
        this.error = 'Failed to update profile. Please try again.';
        this.loading = false;
      }
    });
  }
} 