import React, { useState, useEffect } from 'react';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styled from 'styled-components';


const CheckBox = styled.label`
  display: flex;
  flex-direction: row;
  font-size: 1em;
  padding: 7px 0px;
  margin: 5px 0px;
`
const Button = styled.button`
  font-size: 1em;
  padding: 10px;
`

const UserForm = ({ errors, touched, values, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status){
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div>
      <Form>
        <h1>User Onboarding</h1>
        <Field 
          component="input" 
          type="text" 
          name="name" 
          placeholder="Name" 
        />
        {touched.name && errors.name && (
          <p className="error">{errors.name}</p>
        )}
        <Field 
          component="input" 
          type="text" 
          name="email" 
          placeholder="Email" 
        />
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}
        <Field 
          component="input" 
          type="password" 
          name="password" 
          placeholder="Password" 
        />
        {touched.password && errors.password &&(
          <p className="error">{errors.password}</p>
        )}
        <CheckBox>
          <Field 
            className="check" 
            type="checkbox" 
            name="tos" 
            checked={values.tos} 
          />
        Terms of Service
        </CheckBox>
        {touched.tos && errors.tos &&(
          <p className="error">{errors.tos}</p>
        )}
        <Button>Submit</Button>
      </Form>
      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
};

const formikHOC = withFormik({
  mapPropsToValues({ name, email, password, tos }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please enter your name."),
    email: Yup.string().required("Please enter a valid email address."),
    password: Yup.string().required("Please enter a password"),
    tos: Yup.boolean().required("Please read our Terms of Service")
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        console.log("handleSubmit: then: res: ", res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.log("handleSubmit: catch: err: ", err));
  }
});

const UserFormWithFormik = formikHOC(UserForm);

export default UserFormWithFormik;