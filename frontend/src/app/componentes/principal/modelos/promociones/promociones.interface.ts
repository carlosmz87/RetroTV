import { FormControl, FormGroup } from "@angular/forms";

export interface PromocionesInterface extends FormGroup<{
    asunto:FormControl<string>,
    cuerpo:FormControl<string>
}>{};

