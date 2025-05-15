import { Component, ViewChild, inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { MatSidenavModule, type MatSidenav } from "@angular/material/sidenav"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { HeaderComponent } from "../shared/header/header.component"
import { SidebarComponent } from "../shared/sidebar/sidebar.component"
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout"

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  @ViewChild("drawer") drawer!: MatSidenav

  private breakpointObserver = inject(BreakpointObserver)

  isSidebarOpen = false
  isHandset = false

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isHandset = result.matches
      // Only auto-open sidebar on desktop if it was previously opened
      if (!result.matches && this.isSidebarOpen) {
        this.isSidebarOpen = true
      } else {
        this.isSidebarOpen = false
      }
    })
  }

  toggleSidebar() {
    if (this.isHandset) {
      this.drawer.toggle()
    } else {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
}
