import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonInput, IonIcon, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonIcon, IonButton],
  template: `
    <div class="form-container">
      <ng-container *ngIf="mode === 'login'">
        <div class="input-group">
          <label class="input-label">Correo electrónico</label>
          <div class="input-wrapper">
            <ion-icon name="mail-outline" class="input-icon"></ion-icon>
            <ion-input [(ngModel)]="email" type="email" placeholder="ejemplo@cine.com" class="custom-input"></ion-input>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Contraseña</label>
          <div class="input-wrapper">
            <ion-icon name="lock-closed-outline" class="input-icon"></ion-icon>
            <ion-input [(ngModel)]="password" type="password" placeholder="••••••••" class="custom-input"></ion-input>
          </div>
        </div>
        <button class="glow-button" (click)="onSubmit()">
          Iniciar Sesión <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
      </ng-container>
      
      <ng-container *ngIf="mode === 'register'">
        <div class="input-group">
          <label class="input-label">Nombre completo</label>
          <div class="input-wrapper">
            <ion-icon name="person-outline" class="input-icon"></ion-icon>
            <ion-input [(ngModel)]="name" type="text" placeholder="Tu nombre" class="custom-input"></ion-input>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Correo electrónico</label>
          <div class="input-wrapper">
            <ion-icon name="mail-outline" class="input-icon"></ion-icon>
            <ion-input [(ngModel)]="email" type="email" placeholder="ejemplo@cine.com" class="custom-input"></ion-input>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Contraseña</label>
          <div class="input-wrapper">
            <ion-icon name="lock-closed-outline" class="input-icon"></ion-icon>
            <ion-input [(ngModel)]="password" type="password" placeholder="Mínimo 8 caracteres" class="custom-input"></ion-input>
          </div>
        </div>
        <button class="glow-button" (click)="onSubmit()">
          Crear Cuenta <ion-icon name="person-add-outline"></ion-icon>
        </button>
      </ng-container>
    </div>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 20px; }
    .input-group { display: flex; flex-direction: column; gap: 6px; }
    .input-label { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.05em; color: #cfc2d6; text-transform: uppercase; }
    .input-wrapper { display: flex; align-items: center; background: rgba(6, 14, 32, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 0 16px; transition: all 0.3s ease; }
    .input-wrapper:focus-within { border-color: #ddb7ff; box-shadow: 0 0 10px rgba(221, 183, 255, 0.2); }
    .input-icon { font-size: 20px; color: #cfc2d6; opacity: 0.6; margin-right: 12px; }
    .custom-input { --padding-start: 0; --padding-end: 0; --padding-top: 14px; --padding-bottom: 14px; --color: #dae2fd; --placeholder-color: rgba(207, 194, 214, 0.3); flex: 1; }
    .glow-button { width: 100%; background: #ddb7ff; border: none; border-radius: 12px; padding: 16px 24px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #1e293b; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(221, 183, 255, 0.3); }
    .glow-button:active { transform: scale(0.98); }
    .glow-button ion-icon { font-size: 18px; }
  `]
})
export class AuthFormComponent {
  @Input() mode: 'login' | 'register' = 'login';
  @Output() submitForm = new EventEmitter<any>();
  
  name = '';
  email = '';
  password = '';
  
  onSubmit() {
    if (this.mode === 'login') {
      this.submitForm.emit({ email: this.email, password: this.password });
    } else {
      this.submitForm.emit({ name: this.name, email: this.email, password: this.password });
    }
  }
}