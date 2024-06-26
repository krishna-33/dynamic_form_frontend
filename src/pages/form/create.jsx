import React, { useMemo, useState } from "react";
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Stack,
  TextField,
  Select,
  MenuItem,
  Switch,
  Button,
  Typography,
  FormControlLabel,
} from "@mui/material";
import * as Yup from "yup";
import FormFields from "./formFields";
import {
  ANSWER_TYPE,
  EMAILFIELD,
  NUMBERFIELD,
  TEXTFIELD,
} from "../../constant";
import useAlerts from "../../hooks/useAlerts";
import { usePostApiMutation } from "../../redux/apiSlice";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const initialForm = {
  value: "",
  question: "",
  answerType: "",
  isRequired: false,
  min: null,
  max: null,
};
export default function Create() {
  const authToken = useSelector((state) => state.auth.authToken);
  const { success, error } = useAlerts();
  const [addNewForm, { isLoading, ...porps }] = usePostApiMutation();
  const [formFields, setFormFields] = useState([initialForm]);

  const navigate = useNavigate();

  const { values, touched, errors, handleSubmit, resetForm, ...formik } =
    useFormik({
      initialValues: {
        title: "",
        description: "",
      },
      validationSchema: Yup.object().shape({
        title: Yup.string().required("Title is required!"),
        description: Yup.string().required("Description is required!"),
      }),
      onSubmit: async (values) => {
        try {
          const payload = {
            ...values,
            questions: formFields?.filter((item) => item?.answerType),
          };
          const response = await addNewForm({
            endpoint: "forms",
            authToken,
            body: payload,
          });
          if (response?.data?.success) {
            success("Form Added Successfully!");
            resetForm();
            setFormFields([initialForm]);
            navigate("/forms");
          } else {
            error(response?.error?.data?.message);
          }
        } catch (err) {
          error(err?.message || "Something went wrong!");
        }
      },
    });

  const onAddNewField = (data, index) => {
    const updateFields = formFields.map((field, ind) =>
      ind === index ? { ...data } : field
    );
    updateFields.push({ ...initialForm, isRequired: false });
    setFormFields(JSON.parse(JSON.stringify(updateFields)));
  };

  return (
    <>
      <Stack
        direction={"column"}
        sx={{
          width: "900px",
          maxWidth: "100%",
        }}
        className="form-title"
      >
        <TextField
          fullWidth
          label="Untitled form"
          name="title"
          {...formik?.getFieldProps("title")}
          error={Boolean(touched?.title && errors?.title)}
          helperText={touched?.title && errors?.title}
          sx={{ my: 2 }}
        />
        <TextField
          fullWidth
          label="Form discription"
          name="description"
          {...formik?.getFieldProps("description")}
          error={Boolean(touched?.description && errors?.description)}
          helperText={touched?.description && errors?.description}
          sx={{ my: 2 }}
        />
      </Stack>
      <Stack
        direction={"column"}
        sx={{
          width: "100%",
          maxWidth: "900px",
        }}
        className="form-question"
      >
        <Box>
          <Typography component="h2" sx={{ textDecoration: "underline" }}>
            Add Questions
          </Typography>
        </Box>
        <AddNewField
          field={initialForm}
          index={formFields.length - 1}
          onAddNewField={onAddNewField}
        />

        <Grid container gap={1}>
          {formFields?.length > 1 && (
            <>
              <Stack sx={{ width: "100%", marginTop: 2 }}>
                <Typography component="h2" sx={{ textDecoration: "underline" }}>
                  Preview
                </Typography>
              </Stack>
              {formFields?.map((field, index) => (
                <Grid item md={12}>
                  {field?.answerType && (
                    <>
                      <FormFields
                        type={field?.answerType}
                        field={field}
                        index={index}
                        formik={null}
                        isDisabled={true}
                      />
                      <hr />
                    </>
                  )}
                </Grid>
              ))}
              {formFields?.length > 1 && (
                <Grid item md={12}>
                  <Button disabled={isLoading} onClick={handleSubmit}>
                    {isLoading ? "Loading..." : "Add Form"}
                  </Button>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Stack>
    </>
  );
}

const AddNewField = ({ field, onAddNewField, index }) => {
  const [question, setQuestion] = useState(field?.question ?? "");
  const [answerType, setAnswerType] = useState(field?.answerType ?? "");
  const [answer, setAnswer] = useState(field?.value ?? null);
  const [isRequired, setIsRequired] = useState(field?.isRequired);
  const [min, setMin] = useState(field?.value ?? "");
  const [max, setMax] = useState(field?.value ?? "");

  const onAddField = () => {
    onAddNewField(
      {
        value: answer || "",
        question,
        answerType,
        isRequired,
        min: min,
        max: max,
      },
      index
    );
    setIsRequired(false);
    setQuestion("");
    setAnswerType("");
    setAnswer("");
    setMin("");
    setMax("");
  };

  const isDisable = useMemo(() => {
    if (answerType == NUMBERFIELD) {
      return !(
        question.length &&
        answerType.length &&
        min.length &&
        max.length
      );
    } else if (answerType == TEXTFIELD || answerType == EMAILFIELD) {
      return !(question.length && answerType.length);
    } else {
      return !(question.length && answerType.length && answer?.length);
    }
  }, [answer, answerType, question, min, max]);

  return (
    <>
      <Stack flexDirection="row" alignItems="baseline">
        <TextField
          fullWidth
          placeholder="Enter your question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        {answerType == "number" ? (
          <>
            <TextField
              sx={{ m: 1, width: 300 }}
              fullWidth
              placeholder="Min value"
              value={min}
              onChange={(event) => setMin(event.target.value)}
            />
            <TextField
              sx={{ m: 1, width: 300 }}
              fullWidth
              placeholder="Max value"
              value={max}
              onChange={(event) => setMax(event.target.value)}
            />
          </>
        ) : null}
        <FormControl sx={{ m: 1, width: 350 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Asnwer Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            label="Answer Type"
            value={answerType}
            onChange={(event) => setAnswerType(event.target.value)}
          >
            {ANSWER_TYPE.map((option, index) => {
              return (
                <MenuItem value={option.type} key={`${option.label}-${index}`}>
                  {option.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={isRequired}
              onClick={(event) => setIsRequired(!isRequired)}
            />
          }
          label="Required"
        />
        <Button disabled={isDisable} onClick={onAddField}>
          Add
        </Button>
      </Stack>
      {answerType && (
        <Grid item md={12}>
          <FormFields
            type={answerType}
            field={{ isRequired }}
            isNew={true}
            formik={null}
            answer={answer}
            setAnswer={setAnswer}
          />
        </Grid>
      )}
    </>
  );
};
