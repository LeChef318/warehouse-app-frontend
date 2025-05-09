import { Component, EventEmitter, Input, Output, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatListModule } from "@angular/material/list"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatTooltipModule } from "@angular/material/tooltip"
import { KeycloakService } from "../../../services/auth/keycloak.service"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  @Input() isOpen = true
  @Output() toggleSidebar = new EventEmitter<void>()

  private keycloakService = inject(KeycloakService)

  isManager = this.keycloakService.isManager()

  onToggleSidebar(): void {
    this.toggleSidebar.emit()
  }
}
