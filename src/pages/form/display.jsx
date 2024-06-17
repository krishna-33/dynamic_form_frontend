import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  capitalize,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useLazyGetFormsQuery,
  usePostApiMutation,
} from "../../redux/apiSlice";
import {
  CHECK_BOX,
  RADIO_BUTTON,
  TEXTFIELD,
  NUMBERFIELD,
  EMAILFIELD,
} from "../../constant";
import FormFields from "./formFields";
import Loader from "../../common/loader";
import useAlerts from "../../hooks/useAlerts";
import { useSelector } from "react-redux";

const getLabel = (str = "") => str?.split(" ")?.join("_");

const dynamicValidationSchema = (questions) => {
  let validation = {};
  questions.forEach((q) => {
    switch (q.answerType) {
      case TEXTFIELD:
        validation[getLabel(q.question)] = q.isRequired
          ? Yup.mixed().required("This field is required")
          : Yup.mixed();
        break;
      case NUMBERFIELD:
        validation[getLabel(q.question)] = q.isRequired
          ? Yup.number()
              .min(Number(q.min), `enter more then ${q.min}`)
              .max(Number(q.max), `Enter less than ${q.max}`)
              .required("This field is required")
          : Yup.number()
              .min(Number(q.min), `enter more then ${q.min}`)
              .max(Number(q.max), `Enter less than ${q.max}`);
        break;
      case EMAILFIELD:
        validation[getLabel(q.question)] = q.isRequired
          ? Yup.string()
              .email("Enter valid email")
              .required("This field is required")
          : Yup.string().email("Enter valid email");
        break;
      case RADIO_BUTTON:
        validation[getLabel(q.question)] = q.isRequired
          ? Yup.mixed().required("This field is required")
          : Yup.mixed();
        break;
      case CHECK_BOX:
        validation[getLabel(q.question)] = q.isRequired
          ? Yup.mixed().required("Atleast select one")
          : Yup.mixed();
        break;
    }
  });
  return validation;
};

export default function Display() {
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.authToken);
  const { success, error } = useAlerts();
  const [getFormById, { data, isLoading }] = useLazyGetFormsQuery();
  const [addResponse, { isLoading: isSubmiting }] = usePostApiMutation();
  const [openForm] = usePostApiMutation();
  const [formData, setFormData] = useState({});
  const [initialValues, setInitialvalues] = useState({});
  const { id = "" } = useParams();

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema: formData?.questions?.length
      ? Yup.object().shape({
          ...dynamicValidationSchema(formData.questions),
        })
      : "",
    onSubmit: async (values) => handleSubmit(values),
  });

  useEffect(() => {
    const initial = formData?.questions?.reduce((acc, curr) => {
      const label = getLabel(curr?.question || "");
      if (!acc[label]) {
        acc[label] = "";
      }
      return acc;
    }, {});
    setInitialvalues(initial);
  }, [formData]);

  useEffect(() => {
    id && getFormById({ endpoint: `forms/${id}`, authToken });
    id && handleFormOpen(id);
  }, [id]);

  useEffect(() => {
    data?.data && setFormData(data?.data);
  }, [data]);

  const handleFormOpen = async (id) => {
    try {
      const payload = {
        form_id: id,
      };
      await openForm({ endpoint: "forms/open", authToken, body: payload });
    } catch (err) {
      error(err?.message || "Something went wrong!");
    }
  };
  const { getFieldProps, touched, errors } = formik;

  const handleSubmit = async (values) => {
    try {
      const payload = {
        form_id: id,
        response: data?.data?.questions.map((question) => ({
          question: question?.question,
          answer: values[getLabel(question?.question)],
        })),
      };
      const response = await addResponse({
        endpoint: "forms/response",
        authToken,
        body: payload,
      });
      if (response?.data?.success) {
        success("Response Added Successfully!");
        navigate("/forms");
      } else {
        error(response?.error?.data?.message);
      }
    } catch (err) {
      error(err?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Loader open={isLoading} />
      <Stack
        direction="column"
        sx={{
          width: "900px",
          maxWidth: "100%",
        }}
        className="form-title"
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ textDecoration: "underline" }}
        >
          {capitalize(formData?.title || "")}
        </Typography>
        <Typography variant="subtitle1">{formData?.description}</Typography>
      </Stack>
      <Stack
        direction={"column"}
        sx={{
          width: "100%",
          maxWidth: "900px",
        }}
        className="form-question"
      >
        <Grid container gap={1}>
          {formData?.questions?.map((field, index) => (
            <Grid item md={12}>
              <FormFields
                index={index}
                type={field?.answerType}
                isRequired={field?.isRequired}
                field={field}
                formik={formik}
                isDisabled={false}
              />
              <hr />
            </Grid>
          ))}
        </Grid>
        <Button
          disabled={isLoading}
          onClick={() => {
            formik?.handleSubmit();
          }}
        >
          {isLoading || isSubmiting ? "Loading..." : "Submit"}
        </Button>
      </Stack>
    </>
  );
}
