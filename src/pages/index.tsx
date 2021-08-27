import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { object, mixed, number } from 'yup';
import React from 'react';

const sleep = time => new Promise(accepted => setTimeout(accepted, time));

const Home: NextPage = () => {
  return (
    <Card>
      <CardContent>
        <FormikStepper
          initialValues={{
            firstName: '',
            lastName: '',
            millionaire: false,
            money: 0,
            description: '',
          }}
          onSubmit={async values => {
            await sleep(3000);

            console.log('values', values);
          }}
        >
          <FomikStep label="Personal Data">
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="firstName"
                component={TextField}
                label="FirstName"
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="lastName"
                component={TextField}
                label="LastName"
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                name="millionaire"
                type="checkbox"
                component={CheckboxWithLabel}
                Label={{ label: 'I am a millionaire' }}
              />
            </Box>
          </FomikStep>

          <FomikStep
            label="Bank Accounts"
            validationSchema={object({
              money: mixed().when('millionaire', {
                is: true,
                then: number()
                  .required()
                  .min(1_000_000, 'Because you said you were a millionaire'),
                otherwise: number().required(),
              }),
            })}
          >
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="money"
                type="number"
                component={TextField}
                label="All the money I have"
              />
            </Box>
          </FomikStep>
          <FomikStep label="More Info">
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="description"
                component={TextField}
                label="Description"
              />
            </Box>
          </FomikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
};

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string;
}

export function FomikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = React.useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = React.useState(false);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
          // helpers.resetForm()
          // setStep(0)
        } else {
          setStep(s => s + 1);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index || completed}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {currentChild}

          <Grid container spacing={2}>
            {step > 0 ? (
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  onClick={() => setStep(s => s - 1)}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default Home;
