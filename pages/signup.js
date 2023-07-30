import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { FcGoogle } from "react-icons/fc";
import { Select, IconButton } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Back } from "iconsax-react"
import MenuItem from "@mui/material/MenuItem";
import {
  FormControl,
  Button,
  FormHelperText,
  InputLabel,
  TextField,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  AlertTitle
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Image from "next/image";
import countries from "../utility/country.json";
import Link from "next/link";
import * as Yup from "yup";
import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import Modal from "../components/core/Modal";
import { CREATE_USER, SEND_EMAIL, SIGNUP_GOOGLE, VERIFY_OTP } from "../apollo/api/mutations";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../store/slices/authSlice";
import Router from "next/router";
import PageTransition from "../components/core/PageTransition";
const initialValues = {
  displayName: "",
  username: "",
  email: "",
  country: ""
};

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const pattern = /^[a-zA-Z0-9_-]{3,16}$/;

const validationSchema = Yup.object().shape({
  displayName: Yup.string().matches(pattern, "Please enter a valid display name").min(4, "Display name must be atleast 8 characters.").required("Display name is required"),
  username: Yup.string().matches(pattern, "Please enter a valid Username").min(8, "Username must be atleast 8 characters.").required("Username is required"),
  email: Yup.string().matches(emailRegex, "Please enter a valid email").required("Email is required"),
  country: Yup.string().required("Country is required")
});

const InputLayout = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
    fontSize: 10
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "rgba(225, 225, 225, 0.04)",
    border: "1px solid rgba(225, 225, 225, 0.4)",
    fontSize: 16,
    width: "100%",
    padding: "18px 18px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const signup = () => {
  const [countryModal, setCountryModal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [createUser] = useMutation(CREATE_USER)
  const [sendEmailOtp] = useMutation(SEND_EMAIL)
  const [verifyOtp] = useMutation(VERIFY_OTP)
  const [signUpGoogle] = useMutation(SIGNUP_GOOGLE)
  const [info, setInfo] = useState({})
  const [userData, setUserData] = useState({})
  const [countryCode, setCountryCode] = useState('India')

  const dispatch = useDispatch()

  const handleSendEmail = async (values) => {
    setLoadingModal(true)
    setUserData(values)
    await sendEmailOtp({
      variables: {
        email: values.email
      }
    }).then((res) => {
      setInfo({ type: "success", message: res.data.sendEmailOtp.message });
      setLoadingModal(false)
      setVerifyModal(true)
    }).catch((e) => {
      setInfo({ type: "error", message: e.message });
      setLoadingModal(false);
    });
  }

  const handleVerifyEmail = async () => {
    setLoadingModal(true);
    await verifyOtp({
      variables: {
        email: userData.email,
        otp: parseInt(otp)
      }
    }).then((res) => {
      setInfo({ type: "success", message: res.data.verifyOtp.message })
      handleSubmit()
    }).catch(e => {
      setInfo({ type: "error", message: e.message })
      setLoadingModal(false);
    })
  }

  const handleSubmit = async () => {
    setLoadingModal(true)
    await createUser({
      variables: {
        ...userData
      }
    }).then(res => {
      const newUser = res?.data?.createUser;
      if (newUser) {
        localStorage.setItem('metadata', JSON.stringify(newUser))
        dispatch(setAuthUser(newUser))
        Router.push(`/profile/${newUser._id}`)
        setLoadingModal(false)
      }
    }).catch(e => {
      setLoadingModal(false)
      setVerifyModal(false)
      setInfo({ type: "error", message: e.message });
    });
  };

  const handleGoogleSignin = () => {
    setCountryModal(false)
    setLoadingModal(true)
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('metadata'));
    if (user && user?._id) Router.push('/');
  }, [])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user, err) => {
      if (err) {
        setLoadingModal(false)
        setInfo({ type: "error", message: err.message });
        return
      }
      if (user) {
        signUpGoogle({
          variables: {
            token: user._delegate.accessToken,
            country: countryCode
          }
        }).then(res => {
          setLoadingModal(false)
          setCountryCode(false)
          dispatch(setAuthUser(res.data.signUpGoogle))
          Router.push(`/profile/${res.data.signUpGoogle._id}`)
        }).catch(e => {
          setLoadingModal(false)
          setInfo({ type: "error", message: e.message });
        })
      }
    });
  }, []);

  const [otp, setOtp] = useState('');

  const handleChange = (event) => {
    setOtp(event.target.value);
  };

  // const handleVerifyOtp = async () => {
  //   await verifyOtp({
  //     variables: {
  //       email: emailId,
  //       otp: parseInt(otp)
  //     }
  //   }).then(() => {
  //     setInfo({ type: "success", message: "Email Verification successfull" })
  //   }).catch(e => {
  //     setInfo({ type: "error", message: e.message })
  //   })
  // }

  return (
    <PageTransition>
      <div className="grid md:grid-cols-6 grid-cols-1 h-full md:h-max gradient_page_bg">
        <div className="absolute top-5 left-5" >
          <Link href="/">
            <IconButton>
              <Back />
            </IconButton>
          </Link>
        </div>
        <div className="md:grid md:col-span-2 hidden">
          <div className="relative h-screen ">
            <Image
              src="/signup_back.png"
              alt="Your Alt Text"
              width={100}
              height={100}
              className="w-full h-screen object-cover "
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <Link href="/">
              <div className="absolute top-12 left-6 h-full ">
                <Image src="/inocyx.png" alt="Logo" width={160} height={40} />
              </div>
            </Link>
            <div className="absolute top-80 left-8 right-0 mx-6 my-24">
              <Image
                src="/color_circle.svg"
                alt="Logo"
                width={70}
                height={70}
                className="w-3/4 h-auto"
              />
            </div>
          </div>
        </div>
        <Snackbar
          open={Object.keys(info)?.length > 0}
          autoHideDuration={6000}
          onClose={() => setInfo({})}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          style={{ zIndex: 99999 }}
        >
          <Alert variant="filled" onClose={() => setInfo({})} severity={info.type} sx={{ width: '100%' }}>
            <AlertTitle>{info.type}</AlertTitle>
            {info.message}
          </Alert>
        </Snackbar>
        {/* Right Hand side */}
        <div className="flex flex-col items-center py-4 justify-center col-span-4 md:gap-10 gap-5">
          <h3 className="font-KronaOne font-normal md:text-3xl text-xl text-center text-white">
            Welcome to INOCYX!
          </h3>
          <div className="md:mx-32 mx-10 md:px-12 px-0 md:w-3/5 w-11/12">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSendEmail}
              validationSchema={validationSchema}
            >
              {(errors, touched, handleBlur) => (
                <Form>
                  <div className="mb-6">
                    <FormControl style={{ width: "100%" }}>
                      <Field name="displayName" >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.displayName && form.touched.displayName
                            }
                            mb="4"
                          >
                            <InputLabel
                              shrink
                              htmlFor="displayName"
                              className="text-xl font-inter font-medium -ml-2"
                            >
                              Display Name
                            </InputLabel>

                            <InputLayout
                              {...field}
                              fullWidth
                              inputProps={{
                                style: {
                                  borderRadius: 10
                                }
                              }}
                              placeholder="Enter the display name"
                              name="displayName"
                            />
                            {form.touched.displayName ? <FormHelperText className="mt-2 ml-0 text-red-600">
                              {form.errors.displayName}
                            </FormHelperText> : null}
                          </FormControl>
                        )}
                      </Field>
                    </FormControl>
                  </div>

                  <div className="mb-6">
                    <FormControl style={{ width: "100%" }}>
                      <Field name="username">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.username && form.touched.username
                            }
                            mb="4"
                          >
                            <InputLabel
                              shrink
                              htmlFor="username-input"
                              className="text-xl font-inter font-medium -ml-2"
                            >
                              Username
                            </InputLabel>

                            <InputLayout
                              {...field}
                              fullWidth
                              inputProps={{
                                style: {
                                  borderRadius: 10
                                }
                              }}
                              placeholder="Enter the username"
                              name="username"
                            />
                            {form.touched.username ? <FormHelperText className="mt-2 ml-0 text-red-600">
                              {form.errors.username}
                            </FormHelperText> : null}
                          </FormControl>
                        )}
                      </Field>
                    </FormControl>
                  </div>

                  <div className="mb-6">
                    <FormControl style={{ width: "100%" }}>
                      <Field name="email">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.email && form.touched.email}
                            mb="4"
                          >
                            <InputLabel
                              shrink
                              className="text-xl font-inter font-medium -ml-2"
                            >
                              Email ID
                            </InputLabel>

                            <InputLayout
                              {...field}
                              fullWidth
                              inputProps={{
                                style: {
                                  borderRadius: 10
                                }
                              }}
                              placeholder="Enter the Mail id"
                              name="email"
                            />
                            {form.touched.email ? <FormHelperText className="mt-2 ml-0 text-red-600">
                              {form.errors.email}
                            </FormHelperText> : null}
                          </FormControl>
                        )}
                      </Field>
                    </FormControl>
                  </div>

                  <div className="mb-6">
                    <FormControl style={{ width: "100%" }}>
                      <Field name="country">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.country && form.touched.country
                            }
                          >
                            <div className="my-3">
                              <InputLabel
                                shrink
                                className="text-xl font-inter font-medium mb-9 -ml-2"
                              >
                                Country
                              </InputLabel>
                            </div>

                            <Select
                              {...field}
                              value={field.value}
                              displayEmpty
                              input={<OutlinedInput />}
                              inputProps={{ "aria-label": "Without label", style: { borderRadius: 10 } }}
                              className=""
                            >
                              <MenuItem value="" className="text-[#E1E1E1]/50 ">
                                Select a country
                              </MenuItem>
                              {countries.map((data, index) => (
                                <MenuItem key={index} value={data.name}>
                                  {data.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {form.touched.country ? <FormHelperText className="mt-2 ml-0 text-red-600">
                              {" "}
                              {form.errors.country}
                            </FormHelperText> : null}
                          </FormControl>
                        )}
                      </Field>
                    </FormControl>
                  </div>

                  <Button
                    type="submit"
                    // isLoading={formikProps.isSubmitting}
                    className="w-full py-4 my-5 font-inter text-xl font-normal text-white rounded-lg"
                    style={{
                      background:
                        "linear-gradient(112deg, #06D1F8 4.37%, #DE179E 86.94%)",
                    }}
                  >
                    Sign Up
                  </Button>
                  <div className="my-2 flex justify-center">
                    <p className="font-inter font-normal text-lg text-white ">
                      Don't have an account?
                      <Link
                        href="/login"
                        className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 "
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>

                  <div className="my-5 md:px-24 px-10">
                    <Divider className="font-sans font-normal opacity-20 text-lg">
                      Or
                    </Divider>
                  </div>

                  <div className="flex items-center">
                    <Button
                      onClick={() => setCountryModal(true)}
                      // isLoading={formikProps.isSubmitting}
                      className="w-full bg-white py-4 font-inter font-normal  text-[#2E2E2E] rounded-lg"
                      startIcon={<FcGoogle />}
                    >
                      Continue with Google
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            <Modal open={loadingModal} backdropClosable={false} closable={false}>
              <CircularProgress />
            </Modal>
            <Modal open={countryModal} backdropClosable={false} closable={false}>
              <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
                <h3 className="font-KronaOne text-2xl self-start " >Select your Country</h3>
                <select defaultValue={countryCode} className="p-4 w-full font-sans rounded-xl my-6 text-white bg-white/5 border-2 border-white/10" onChange={(e) => setCountryCode(e.target.value)} >
                  {countries.map((country) =>
                    <option value={country.name} >{country.name}</option>)}
                </select>
                <Button
                  disabled={!countryCode}
                  className=" w-content self-start px-8 rounded-xl text-white btn-gradient p-3 hover:brightness-110"
                  onClick={() => handleGoogleSignin()}
                >
                  Submit
                </Button>
              </div>
            </Modal>
            <Modal open={verifyModal} backdropClosable={false} closable={false}>
              <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
                <h3 className="font-KronaOne text-2xl self-start " >Verification Code</h3>
                <span className="my-2 text-lg opacity-60 self-start" >Please enter the OTP sent to {userData.email}</span>
                <TextField
                  label="Enter OTP"
                  variant="outlined"
                  type="number"
                  value={otp}
                  className="w-full my-6"
                  onChange={handleChange}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
                />
                <Button
                  disabled={otp.length < 6}
                  className=" w-content self-start px-8 rounded-xl text-white btn-gradient p-3 hover:brightness-110"
                  onClick={() => handleVerifyEmail()}
                >
                  Submit
                </Button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </PageTransition >
  );
};

export default signup;
