import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class ContactComponent {
  constructor(private fb: FormBuilder, private messageService: MessageService) {}

  contactForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    message: ["", [Validators.required, Validators.maxLength(300)]]
  });

  onSubmit() {
    if (this.contactForm.invalid) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez remplir correctement le formulaire."
      });
      return;
    }

    setTimeout(() => {
      this.messageService.add({
        severity: "success",
        summary: "Succès",
        detail: "Demande de contact envoyée avec succès."
      });
      this.contactForm.reset();
    }, 1000);
  }

  get email() {
    return this.contactForm.get("email");
  }

  get message() {
    return this.contactForm.get("message");
  }
}
