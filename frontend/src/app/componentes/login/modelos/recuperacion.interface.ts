import { FormGroup, FormControl } from "@angular/forms";
export interface RecuperacionInterface extends FormGroup<{
    correo: FormControl<string>
}>{}
