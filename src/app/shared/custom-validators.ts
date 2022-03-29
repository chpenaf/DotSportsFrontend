import { FormControl } from "@angular/forms";

export const FnValidaRut = {
  validaRutControl( control: FormControl) {
    const valor = control.value?.trim().toUpperCase();
    if(!FnValidaRut.validaRut(valor)){
      return { not_valid: true }
    } else {
      return null;
    }
  },
  // Valida el rut con su cadena completa "XXXXXXXX-X"
	validaRut : function (rutCompleto: string) {
		if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
			return false;
		var tmp 	= rutCompleto.split('-');
		var digv	= tmp[1];
		var rut 	= tmp[0];
		if ( digv == 'K' ) digv = 'k' ;
		return (FnValidaRut.dv(rut) == digv );
	},
	dv : function(T: any){
		var M=0,S=1;
		for(;T;T=Math.floor(T/10))
			S=(S+T%10*(9-M++%6))%11;
		return S?S-1:'k';
	}


}

