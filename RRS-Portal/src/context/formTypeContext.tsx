import React from 'react';

interface IContext {
    value: string,
    setFormType: Function
}

const FormContext = React.createContext({
    value: '',
    setFormType: (data : string) => {}
});

export default FormContext;