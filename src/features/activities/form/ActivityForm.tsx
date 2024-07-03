import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Header, Segment } from "semantic-ui-react";
import { v4 as uuid } from "uuid";

import { useStore } from "../../../app/stores/store.ts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity.ts";
import LoadingComponent from "../../../app/layout/LoadingComponent.tsx";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../../app/common/form/TextInput.tsx";
import TextArea from "../../../app/common/form/TextArea.tsx";
import SelectInput from "../../../app/common/form/SelectInput.tsx";
import { categoryOptions } from "../../../app/common/options/categoryOptions.ts";
import DateInput from "../../../app/common/form/DateInput.tsx";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: null,
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required("Date is required").nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]);

  function handleFormSubmit(activity: Activity) {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`),
      );
    } else {
      updateActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`),
      );
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <TextInput placeholder="Title" name="title" />

            <TextArea rows={3} placeholder="Description" name="description" />
            <SelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <DateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="Time"
              dateFormat="MMMM D, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <TextInput placeholder="City" name="city" />
            <TextInput placeholder="Venue" name="venue" />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
