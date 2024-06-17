import React from 'react'
import CustomTextField from './TextField';
import CustomCheckBox from './CheckBox';
import CustomRadio from './Radio';

import { CHECK_BOX, EMAILFIELD, NUMBERFIELD, RADIO_BUTTON, TEXTFIELD } from '../../../constant';

export default function FormFields({ type = "", ...props }) {
    switch (type) {
        case TEXTFIELD:
        case NUMBERFIELD:
        case EMAILFIELD:
            return <CustomTextField {...props} />
           
        case CHECK_BOX:
            return <CustomCheckBox {...props} />
           
        case RADIO_BUTTON:
            return <CustomRadio {...props} />
            
        default:
            return <h4>Type Not found</h4>

    }
}
