import { ErrorMessage, Form, Formik } from "formik";
import TextInput from "../../app/common/form/TextInput.tsx";
import { Button, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import ValidationError from "../errors/ValidationError.tsx";

export default observer(function RegisterForm() {
  const { userStore } = useStore();
  return (
    <Formik
      initialValues={{
        displayName: "",
        username: "",
        email: "",
        password: "",
        error: null,
      }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
      validationSchema={Yup.object({
        displayName: Yup.string().required("Required"),
        username: Yup.string().required("Required"),
        email: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form
          className="ui form error"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Header
            as="h2"
            content="Sign up to Reactivities"
            color="teal"
            textAlign="center"
          />
          <TextInput placeholder="Email" name="email" />
          <TextInput placeholder="Display Name" name="displayName" />
          <TextInput placeholder="Username" name="username" />
          <TextInput placeholder="Password" name="password" type="password" />
          <ErrorMessage
            name="error"
            render={() => (
              <ValidationError errors={errors.error as unknown as string[]} />
            )}
          />
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            loading={isSubmitting}
            positive
            content="Register"
            type="submit"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
