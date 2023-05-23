import { FormGroup, FormControl } from "@angular/forms";
export interface LoginInterface extends FormGroup<{
    username: FormControl<string>,
    contrasena: FormControl<string>
}>{}
