import { useEffect, useState } from "react";
import { getUserDetails } from "../apollo/api/query";
import client from "../apollo/apolloClient";
import { uploadFileToS3 } from "../utility";
import {
  ChevronLeft,
  AddAPhoto,
} from "@mui/icons-material";
import AWS from "aws-sdk"
import { ButtonBase, IconButton } from "@mui/material";
import {
  UpdateProfile,
  UploadProfileBanner,
  uploadProfilePic,
} from "../apollo/api/mutations";
import Router from "next/router";
import { Snackbar, Alert } from "@mui/material";
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik";
import Loader from "../components/core/Loader";
import { useAccount } from "wagmi";
import axios from "axios";

function EditProfile() {
  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [openImageError, setOpenImageError] = useState(false);
  const [openImageSizeError, setOpenImageSizeError] = useState(false);
  const [loader, setLoader] = useState(false);
  const { address } = useAccount();
  const account = address

  useEffect(() => {
    const userMeta = JSON.parse(localStorage.getItem('metadata'));
    if (userMeta) {
      client
        .query({
          query: getUserDetails,
          variables: { id: userMeta._id },
        })
        .then((res) => {
          if (res?.data?.getUserById) {
            setUser({
              id: res?.data?.getUserById._id,
              displayName: res?.data?.getUserById.displayName,
              email: res?.data?.getUserById.email,
              website: res?.data?.getUserById.website,
              username: res?.data?.getUserById.username,
              profilePic: res?.data?.getUserById.profilePic,
              banner: res?.data?.getUserById.banner,
              twitter: res?.data?.getUserById.twitter,
              shortBio: res?.data?.getUserById.shortBio,
            });
          }
        })
        .catch((e) => {
        });
    }
  }, []);

  const handleProfileUpload = async (fileArr) => {
    setLoader(true)
    const file = fileArr?.target?.files?.[0]
    // const image = await axios.post('https://2vkk3ezb8k.execute-api.ap-south-1.amazonaws.com/prod/image-uploader', {
    //   file: file,
    //   filename: file.name
    // })
    // console.log(image)
    // setLoader(true)
    let image = await uploadFileToS3(file)
    if (image !== "") {
      const uploadedFileUrl = image;
      client
        .mutate({
          mutation: uploadProfilePic,
          variables: {
            id: user.id,
            imageURL: uploadedFileUrl,
          },
        })
        .then((res) => {
          if (res?.data?.uploadProfilePic) {
            setUser(res?.data?.uploadProfilePic);
            setOpenSnack(true);
            setLoader(false)
            setTimeout(() => {
              setOpenSnack(false);
              // Router.push(`/profile/${account}`)
            }, 2000);
          }
        })
        .catch((e) => {
          setLoader(false)
        });
    }
  }
  // });

  const handleBannerUpload = async (fileArr) => {
    if (fileArr?.target?.files?.[0] !== undefined) {
      if (fileArr?.target?.files?.[0]?.size <= 10, 240) {
        const file = fileArr?.target?.files?.[0];
        let img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();
        let width = img.width;
        let height = img.height;
        if (width >= 400 && height >= 1280) {
          setLoader(true)
          console.log(file);
          let image = await uploadFileToS3(file)

          if (image !== "") {
            const uploadedFileUrl = image;
            client
              .mutate({
                mutation: UploadProfileBanner,
                variables: {
                  id: user.id,
                  imageURL: uploadedFileUrl,
                },
              })
              .then((res) => {
                if (res?.data?.UploadProfileBanner) {
                  console.log(res);
                  setUser(res?.data?.UploadProfileBanner);
                  setLoader(false)
                  setOpenSnack(true);
                  setTimeout(() => {
                    setOpenSnack(false);
                    // Router.push(`/profile/${account}`)
                  }, 2000);
                }
              })
              .catch((e) => {
                console.log(e);
                setLoader(false)
              });
          }
        }
        else {
          // Show Toast
          console.log("Error");
          setOpenImageError(true);
          setTimeout(() => {
            setOpenImageError(false);
          }, 3000);
        }
      }
      else {
        // Show Toast
        console.log("Error");
        setOpenImageSizeError(true);
        setTimeout(() => {
          setOpenImageSizeError(false);
        }, 3000);
      }
    }
    else {
      console.log("image not uploaded");
    }
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    setLoader(true)
    client
      .mutate({
        mutation: UpdateProfile,
        variables: {
          id: user.id,
          ...e,
        }
      })
      .then((res) => {
        if (res?.data?.updateProfile) {
          setUser(res?.data?.updateProfile);
          localStorage.setItem('metadata', JSON.stringify(res?.data?.updateProfile))
          setLoader(false)
          setOpenSnack(true);
          setTimeout(() => {
            setOpenSnack(false);
            Router.push(`/profile/${res?.data?.updateProfile?._id}`);
          }, 2000);
        }
      })
      .catch((e) => {
        setLoader(false)
      });
  };

  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!"),
    username: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Enter your username"),
    email: Yup.string()
      .email("Invalid email")
      .required("Enter your email address"),
    shortBio: Yup.string()
      .min(10, "Too Short!")
      .max(250, "Too Long!"),
    website: Yup.string()
      .matches(
        "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)",
        "Enter a valid url"
      ),
    twitter: Yup.string()
      .matches(
        '(https:\/\/twitter.com\/(?![a-zA-Z0-9_]+\/)([a-zA-Z0-9_]+))',
        "Enter a valid twitter url"
      ),
  });

  return user ? (
    <>
      <Loader isLoading={loader} />
      <label
        htmlFor="bannerPic"
        className="group fixed top-0 left-0 z-0 -mt-10 flex h-80 w-full cursor-pointer items-center justify-center"
        style={{ zIndex: -10 }}
      >
        <img
          src={user?.banner ?? "/dummyBanner.png"}
          alt="Background"
          className="group-hover:opacity-60 object-cover w-full h-[100%]"
        />
        <input
          onChange={(e) => handleBannerUpload(e)}
          // onInput={(e) => handleBannerUpload(e)}
          accept=".png, .jpeg, .jpg, .webp"
          type="file"
          id="bannerPic"
          name="bannerPic"
          className="hidden"
        />
        <AddAPhoto className="absolute hidden text-4xl opacity-60 group-hover:block" />
      </label>
      <IconButton
        onClick={() => Router.back()}
        className="absolute top-20 left-6 bg-black/60"
      >
        <ChevronLeft />
      </IconButton>
      <div className="bg-forground">
        <div className="z-40 mx-auto mt-56 flex w-11/12 md:w-4/5 flex-col items-start py-10 ">
          <label
            htmlFor="profilePic"
            className="group -ml-2 -mt-24 flex w-24 h-24 md:h-32 md:w-32 items-center justify-center overflow-hidden rounded-3xl border-8 border-forground bg-forground hover:cursor-pointer hover:brightness-75"
          >
            <input
              onChange={(e) => handleProfileUpload(e)}
              accept=".png, .jpeg, .jpg, .webp"
              type="file"
              id="profilePic"
              name="profilePic"
              className="hidden"
            />
            <img
              src={user?.profilePic ?? "/dummyAvatar.png"}
              alt="profile"
              className="scale-150 transform"
            />
            <AddAPhoto className="absolute hidden text-4xl group-hover:block" />
          </label>
          <div className="grid grid-cols-5 items-start justify-start  w-full gap-10 ">
            <Formik
              initialValues={{
                displayName: user?.displayName,
                username: user?.username,
                email: user?.email,
                website: user?.website,
                twitter: user?.twitter,
                shortBio: user?.shortBio,
              }}
              validateOnChange
              enableReinitialize
              validateOnBlur
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
              }}
            >
              {({ values, errors, touched }) => {
                return (
                  <Form className="w-full md:col-span-3 col-span-5" >
                    <div className="mt-6 flex flex-col ">
                      <label htmlFor="displayName">Display Name</label>
                      <Field
                        name="displayName"
                        id="displayName"
                        type="text"
                        placeholder="enter your displayName"
                        className="mt-2 rounded-lg bg-white/5 hover:border-white/10 border-transparent border-[1px] p-4"
                      />
                      <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                        <ErrorMessage name="displayName" />
                      </p>
                    </div>
                    <div className="mt-6 flex flex-col">
                      <label htmlFor="username">Username</label>
                      <Field
                        name="username"
                        id="username"
                        type="text"
                        disabled
                        placeholder="enter your username"
                        className="mt-2 rounded-lg bg-white/5 hover:border-white/10 border-transparent border-[1px] p-4 pointer-events-none"
                      />
                      <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                        <ErrorMessage name="username" />
                      </p>
                    </div>
                    <div className="mt-6 flex flex-col">
                      <label htmlFor="shortBio">Short bio</label>
                      <Field
                        name="shortBio"
                        id="shortBio"
                        type="text"
                        placeholder="enter your short bio"
                        className="mt-2 rounded-lg bg-white/5 hover:border-white/10 border-transparent border-[1px] p-4"
                      />
                      <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                        <ErrorMessage name="shortBio" />
                      </p>
                    </div>
                    <div className="mt-6 flex flex-col pointer-events-none">
                      <label htmlFor="email">Email Address</label>
                      <Field
                        name="email"
                        id="email"
                        type="text"
                        disabled
                        placeholder="enter your email"
                        className="mt-2 rounded-lg bg-white/5 hover:border-white/10 border-transparent border-[1px] p-4"
                      />
                      <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                        <ErrorMessage name="email" />
                      </p>
                    </div>
                    <div>
                      <p className="mt-8 font-sans text-xl font-bold">
                        Social media links
                      </p>
                      <p className="font-sans text-sm font-bold opacity-60">
                        Add your existing social links to build a stronger
                        reputation
                      </p>
                      <div className="mt-6 flex flex-col">
                        <label htmlFor="website">Website</label>
                        <Field
                          name="website"
                          id="website"
                          type="text"
                          placeholder="enter your website"
                          className="mt-2 rounded-lg bg-white/5 hover:border-white/10 border-transparent border-[1px] p-4"
                        />
                        <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                          <ErrorMessage name="website" />
                        </p>
                      </div>
                      <div className="mt-6 flex flex-col">
                        <label htmlFor="twitter">Twitter</label>
                        <Field
                          name="twitter"
                          id="twitter"
                          type="text"
                          placeholder="enter your twitter handle"
                          className="mt-2 rounded-lg bg-white/5 hover:border-white/10 border-transparent border-[1px] p-4"
                        />
                        <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                          <ErrorMessage name="twitter" />
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-row items-center justify-start">
                      <ButtonBase
                        type="submit"
                        className="rounded-xl bg-primary px-6 py-3"
                      >
                        Update
                      </ButtonBase>
                      <button
                        onClick={() => Router.back()}
                        className="ml-2 rounded-xl bg-gray-600 px-6 py-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <div className="grid grid-rows-2 col-span-5 md:col-span-2 rounded-xl bg-white/10 p-4 max-w-max max-h-min">
              <img src="/verified.svg" alt="verified" className="row-span-2 w-full" />
              <div className="row-span-1 flex flex-col items-start">
                <p className="mt-6 text-2xl font-bold">Verify your account</p>
                <p className="mt-2 opacity-50">
                  Proceed with verification process to get more visibility and
                  gain trust on Rarible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={6000}
        message="Profile Updated"
      >
        <Alert
          severity="success"
          sx={{ width: "100%", backgroundColor: "green" }}
        >
          Profile Updated
        </Alert>
      </Snackbar>
      <Snackbar
        open={openImageError}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={3000}
        message="Minimum Image dimensions is 1280x400"
      >
        <Alert
          severity="error"
          sx={{ width: "100%", backgroundColor: "red", color: "white" }}
        >
          Minimum Image dimensions is 1280 x 400
        </Alert>
      </Snackbar>
      <Snackbar
        open={openImageSizeError}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={3000}
        message="Maximum file size is 10MB"
      >
        <Alert
          severity="error"
          sx={{ width: "100%", backgroundColor: "red", color: "white" }}
        >
          Maximum file size is 10MB
        </Alert>
      </Snackbar>
    </>
  ) : (
    <></>
  );
}

export default EditProfile;
