import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { FcGoogle } from "react-icons/fc";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormHelperText,
  TextField,
  InputLabel,
  Snackbar,
  Alert,
  AlertTitle,
  Divider,
  CircularProgress,
  ButtonGroup,
  IconButton,
} from "@mui/material";
import * as Yup from "yup"
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import Modal from "../components/core/Modal";
import { useMutation } from "@apollo/client";
import { SEND_EMAIL, VERIFY_OTP_LOGIN } from "../apollo/api/mutations";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../store/slices/authSlice";
import Router from "next/router";
import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import PageTransition from "../components/core/PageTransition";
import { Back, Edit } from "iconsax-react";
const initialValues = {
  email: "",
};

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object().shape({
  // displayName: Yup.string().matches(pattern, "Please enter a valid display name").min(4, "Display name must be atleast 8 characters.").required("Display name is required"),
  // username: Yup.string().matches(pattern, "Please enter a valid Username").min(8, "Username must be atleast 8 characters.").required("Username is required"),
  email: Yup.string().matches(emailRegex, "Please enter a valid email").required("Email is required"),
  // country: Yup.string().required("Country is required")
});

const InputLayout = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
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

const login = () => {
  const [verifyModal, setVerifyModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [verifyOtpLogin] = useMutation(VERIFY_OTP_LOGIN)
  const [sendEmailOtp] = useMutation(SEND_EMAIL)
  const [info, setInfo] = useState({})
  const [emailId, setEmailId] = useState("")
  const [otp, setOtp] = useState('');

  const handleChange = (event) => {
    if (event.target.value?.length <= 6) {
      setOtp(event.target.value);
    }
  };

  const dispatch = useDispatch()

  const handleSendEmail = async (values) => {
    setLoadingModal(true)
    setEmailId(values.email)
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
    setVerifyModal(false);
    setTimeout(async () => {
      if (otp && otp.length === 6) {
        await verifyOtpLogin({
          variables: {
            email: emailId,
            otp: parseInt(otp)
          }
        }).then((res) => {
          setVerifyModal(false);
          localStorage.setItem('metadata', JSON.stringify(res.data.verifyOtpLogin.user))
          setInfo({ type: "success", message: res.data.verifyOtpLogin.message })
          dispatch(setAuthUser(res.data.verifyOtpLogin.user))
          Router.push(`/profile/${res.data.verifyOtpLogin.user._id}`)
        }).catch(e => {
          setVerifyModal(true);
          setInfo({ type: "error", message: e.message })
          setLoadingModal(false);
        })
      }

    }, 3000)
  }

  const handleGoogleSignin = () => {
    setLoadingModal(true)
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user, err) => {
      if (err) {
        setLoadingModal(false)
        setInfo({ type: "error", message: err.message });
        return
      }
      if (user) {
        handleSendEmail({ email: user._delegate.email })
      }
    });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('metadata'));
    if (user && user?._id) Router.push('/');
  }, [])

  return (
    <PageTransition>
      <div className="grid md:grid-cols-6 grid-cols-1 h-screen overflow-hidden relative gradient_page_bg">
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
            <Link href="/" >
              <div className="absolute top-12 left-12 h-full ">
                <Image src="/inocyx.png" alt="Logo" width={160} height={40} />
              </div>
            </Link>
            <div className="absolute top-80 left-8 right-0 mx-6 my-24">
              <Image src="/color_circle.svg" alt="Logo" width={70} height={70} className="w-3/4 h-auto" />
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
        <div className="flex flex-col items-center justify-center col-span-4 md:gap-10 gap-5 ">
          <h3 className="font-KronaOne font-normal md:text-3xl text-xl text-center text-white">
            Welcome back!
          </h3>
          <div className="md:mx-32 mx-10 md:px-12 px-0 md:w-3/5 w-11/12">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSendEmail}
              validationSchema={validationSchema}
            >
              {(formikProps) => (
                <Form>
                  <div className="mb-6">
                    <FormControl style={{ width: "100%" }}>
                      <Field name="email">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.email && form.touched.email
                            }
                            mb="4"
                          >
                            <InputLabel
                              shrink
                              htmlFor="email-input"
                              className="text-xl font-inter font-medium -ml-2"
                            >
                              Email
                            </InputLabel>

                            <InputLayout
                              {...field}
                              autoFocus
                              fullWidth
                              inputProps={{
                                style: {
                                  borderRadius: 10
                                }
                              }}
                              placeholder="Enter the email"
                              name="email"
                            />
                            <FormHelperText className="mt-2 ml-0 text-red-600">
                              {form.errors.email}
                            </FormHelperText>
                          </FormControl>
                        )}
                      </Field>
                    </FormControl>
                  </div>


                  <Button
                    type="submit"
                    isLoading={formikProps.isSubmitting}
                    className="w-full py-4 my-5 font-inter text-xl font-normal text-white rounded-lg"
                    style={{ background: "linear-gradient(112deg, #06D1F8 4.37%, #DE179E 86.94%)" }}
                  >
                    Sign in
                  </Button>
                  <div className="my-2 flex justify-center">
                    <p className="font-inter font-normal text-lg text-white ">
                      Don't have an account?
                      <Link href="/signup" className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 ">Sign Up</Link>
                    </p>
                  </div>

                  <div className="my-10 md:px-24 px-10">
                    <Divider className="font-sans opacity-20 font-normal  text-lg">
                      Or
                    </Divider>
                  </div>

                </Form>
              )}
            </Formik>
            <div className="flex items-center">
              <Button
                type="submit"
                className="w-full bg-white py-4 font-inter font-normal  text-[#2E2E2E] rounded-lg"
                onClick={handleGoogleSignin}
                startIcon={<FcGoogle />}
              >

                Continue with Google
              </Button>
            </div>
          </div>
          <Modal open={loadingModal} backdropClosable={false} closable={false}>
            <CircularProgress />
          </Modal>
          <Modal open={verifyModal} backdropClosable={false} closable={false}>
            <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
              <h3 className="font-KronaOne text-2xl self-start " >Verification Code</h3>
              <span className="my-2 text-lg opacity-60 self-start" >Please enter the OTP sent to <span className="flex flex-row gap-2" >{emailId} <Edit onClick={() => setVerifyModal(false)} className="w-6 h-6 hover:brightness-50 cursor-pointer" /> </span></span>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleVerifyEmail()
              }} style={{ width: "100%" }} >
                <FormControl style={{ width: "100%" }} >
                  <TextField
                    label="Enter OTP"
                    variant="outlined"
                    type="number"
                    autoFocus
                    autoComplete={false}
                    value={otp}
                    className="w-full my-6"
                    onChange={(e) => handleChange(e)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
                  />
                  <Button
                    disabled={otp.length < 6}
                    className=" w-content self-start px-8 rounded-xl text-white btn-gradient p-3 hover:brightness-110"
                    onClick={() => handleVerifyEmail()}
                  >
                    Submit
                  </Button>
                </FormControl>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </PageTransition>
  );
};

export default login;
