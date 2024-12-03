import * as Yup from 'yup';


const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;


const validationSchema = Yup.object().shape({
   username: Yup.string().when('isLogin', {
       is: false,
       then: Yup.string().required('Username is required')
       .min(8, 'Username must be at least 8 characters long'),
   }),
   email: Yup.string().email('Invalid email').required('Email is required'),
   password: Yup.string()
       .min(8, 'Password must be at least 8 characters')
       .max(32, 'Password must be at most 32 characters')
       .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
       .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
       .matches(specialCharacters, 'Password must contain at least one special character')
       .required('Password is required'),
   dateOfBirth: Yup.date().when('isLogin', {
       is: false,
       then: Yup.date().required('Date of Birth is required').nullable(),
   }),
   phoneNumber: Yup.string().when('isLogin', {
       is: false,
       then: Yup.string()
           .required('Phone number is required')
           .matches(/^[0-9]+$/, 'Phone number must be digits only')
           .min(10, 'Phone number must be at least 10 digits')
           .max(15, 'Phone number must be at most 15 digits'),
   }),
}).noUnknown();


export default validationSchema;