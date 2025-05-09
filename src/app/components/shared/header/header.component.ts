import { Component, EventEmitter, Output, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { KeycloakService } from "../../../services/auth/keycloak.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>()

  private keycloakService = inject(KeycloakService)
  private router = inject(Router)

  username = this.keycloakService.getUsername()

  onToggleSidebar(): void {
    this.toggleSidebar.emit()
  }

  logout(): void {
    this.keycloakService.logout()
  }

  navigateToProfile(): void {
    this.router.navigate(["/profile"])
  }
}
