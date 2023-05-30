import { FormControl, FormGroup } from "@angular/forms";

export interface ClasificacionInterface extends FormGroup<{
    nombre:FormControl<string>
}>{};

