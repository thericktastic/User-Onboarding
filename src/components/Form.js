import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = ({ values, errors, touched, status }) => {
    const [users, setNewUsers] = useState([]);
    useEffect(() => {
        console.log(
            "status has changed", status
            );
        status && setNewUsers(users => [
            ...users,
            status
        ]);
    }, [status]);

  return (
    <div className="user-form">
      <Form>
        <label htmlFor="usersname">
          Name:
          <Field 
          id="usersname" 
          type="text" 
          name="usersname" 
          value={values.usersname} />
          {touched.usersname &&
            errors.usersname && (
              <p className="errors">
                {errors.usersname}
              </p>
            )}
        </label>
        <label htmlFor="email">
          Email:
          <Field 
          id="email" 
          type="text" 
          name="email" 
          value={values.email} />
          {touched.email &&
            errors.email && (
              <p className="errors">
                {errors.email}
              </p>
            )}
        </label>
        <label htmlFor="password">
          Password:
          <Field 
          id="password" 
          type="text" 
          name="password" 
          value={values.password} />
          {touched.password &&
            errors.password && (
              <p className="errors">
                {errors.password}
              </p>
            )}
        </label>
        <label htmlFor="terms">
          Terms of Service: 
          <Field 
          id="terms" 
          type="checkbox" 
          name="terms" 
          checked={values.terms} />
          {touched.terms &&
            errors.terms && (
              <p className="errors">
                {errors.terms}
              </p>
            )}
        </label>
        <button>Submit</button>
      </Form>
      {users.map(user => (
        <ul key={user.id}>
          <li>Name: {user.usersname}</li>
          <li>Email: {user.email}</li>
          <li>Password: {user.password}</li>
          <li>Terms: {user.terms}</li>
        </ul>
      ))}
    </div>
  );
};

const FormikUserForm = withFormik({
  mapPropsToValues({
      usersname,
      email,
      password,
      terms
  }) {
    return {
      usersname: "",
      email: "",
      password: "",
      terms: terms || false,
    };
  },
  validationSchema: Yup.object().shape({
    usersname: Yup.string()
    .min(3, "Your name must be more than 2 characters")
    .required("You must enter a name"),
    email: Yup.string()
    .email("But it must be a super legit email address")
    .required("You must type SOMETHING"),
    password: Yup.string()
    .min(5, "Your password must be more than 4 characters")
    .required("You must enter a password"),
    terms: Yup.boolean()
    .oneOf([true], "If you don't agree to the Terms of Service you will suffer the consequences")
  }),
  handleSubmit(values, { setStatus }) {
      console.log("submitting", values);
      axios.post(
          "https://reqres.in/api/users/",
          values
      )
      .then(res => {
          console.log("axios.post successful:", res);
          setStatus(res.data);
      })
      .catch(err => console.log(err.response)
      );
  }
})(UserForm);

export default FormikUserForm;