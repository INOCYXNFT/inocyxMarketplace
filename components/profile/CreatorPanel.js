import Router, { useRouter } from 'next/router'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import NFT from '../core/NFT'
import EmptyState from '../core/EmptyState'
import client from '../../apollo/apolloClient'
import { applyForCreator } from '../../apollo/api/mutations'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { getUserDetails } from '../../apollo/api/query'
import { useState, useEffect } from 'react'
import Loader from '../core/Loader'

const steps = ['Form Submited', 'Review', 'Approved']

// applyForCreator
// getCreatedNFTsByWallet

function CreatorPanel({ assets }) {
  const [userDetails, setUserDetails] = useState([])
  const [loader, setLoader] = useState(false)
  const router = useRouter()

  const fetchUser = (id) => {
    setLoader(true)
    client
      .query({
        query: getUserDetails,
        variables: { id: id },
      })
      .then((res) => {
        if (res?.data?.getUserById) {
          setLoader(false)
          setUserDetails(res?.data?.getUserById)
        }
      })
      .catch(() => {
        setLoader(false)
      })
  }

  useEffect(() => {
    if (Router) fetchUser(Router.query.id)
  }, [userDetails])

  const handleApplyCreator = (e) => {
    let payload = e;
    payload['userId'] = userDetails?._id
    console.log(payload)
    setLoader(true)
    client
      .mutate({
        mutation: applyForCreator,
        variables: payload,
      })
      .then(() => {
        fetchUser(Router.query.id)
        setLoader(false)
        router.reload()
      })
      .catch(() => {
        setLoader(false)
      })
  }

  const validationSchema = Yup.object().shape({
    description: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Enter your description'),
    showcaseURL: Yup.string()
      .matches(
        '((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)',
        'Enter a valid url',
      ),
    // .required('Enter your showcase url'),
    instagramHandle: Yup.string()
      .matches(
        '((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)',
        'Enter a valid url',
      ),
    // .required('Enter your intagramHandle'),
    websiteURL: Yup.string()
      .matches(
        '((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)',
        'Enter a valid url',
      ),
    // .required('Enter your website'),
    twitterHandle: Yup.string()
      .matches(
        '((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)',
        'Enter a valid url',
      )
    // .required('Enter your twitter handle'),
  })

  return <div className="z-50 rounded-xl w-11/12  md:w-1/2 h-3/4 overflow-scroll no-scroll p-6 gradient_page_bg bg-background transition-all ">
    {userDetails?.isCreatorApplicationInReview ? (
      <div className=" mx-auto flex flex-col  items-center ">
        <h1 className="mt-10 text-3xl font-bold">Apply for creator</h1>
        <p className="mt-2  text-center text-lg opacity-60 ">
          Being a content creator helps you raise money from your assets and
          populariy among our community members
        </p>
        <Stepper
          activeStep={userDetails?.isCreatorApplicationInReview ? 1 : 0}
          alternativeLabel
          className="my-20 w-full"
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
              // onClick={() => setApplied(true)}
              >{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    ) : !userDetails?.isCreator && (
      <div className="mx-auto flex font-sans flex-col items-center">
        <h1 className="mt-10 text-xl md:text-3xl font-bold">Apply for creator</h1>
        <p className="mt-2  text-center md:text-lg text-md opacity-60 ">
          Being a content creator helps you raise money from your assets and
          populariy among our community members
        </p>
        <Formik
          initialValues={{
            description: '',
            websiteURL: '',
            showcaseURL: '',
            instagramHandle: '',
            twitterHandle: '',
          }}
          validateOnChange
          enableReinitialize
          validateOnBlur
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            console.log(values)
            handleApplyCreator(values)
            // resetForm()
          }}
        >
          {(
            // { values, errors, touched }
          ) => {
            return (
              <Form className="flex w-full flex-col items-center">
                <div className="mt-2 flex w-full flex-col">
                  <label htmlFor="email">Description</label>
                  <Field
                    name="description"
                    id="description"
                    type="text"
                    rows={4}
                    placeholder="enter your description"
                    className="mt-2 rounded-xl bg-white/5 p-4"
                  />
                  <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                    <ErrorMessage name="description" />
                  </p>
                </div>
                <div className="w-full">
                  <p className="mt-4 font-sans text-xl font-bold">
                    Social media links
                  </p>
                  <p className="font-sans text-sm font-bold opacity-60">
                    Add your existing social links to build a stronger
                    reputation
                  </p>
                  <div className="mt-2 flex w-full flex-col">
                    <label htmlFor="websiteURL">Website</label>
                    <Field
                      name="websiteURL"
                      id="websiteURL"
                      type="text"
                      placeholder="enter your websiteURL"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                    />
                    <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                      <ErrorMessage name="websiteURL" />
                    </p>
                  </div>
                  <div className="mt-2 flex w-full flex-col">
                    <label htmlFor="showcaseURL">Showcase </label>
                    <Field
                      name="showcaseURL"
                      id="showcaseURL"
                      type="text"
                      placeholder="enter your showcaseURL"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                    />
                    <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                      <ErrorMessage name="showcaseURL" />
                    </p>
                  </div>
                  <div className="mt-2 flex w-full flex-col">
                    <label htmlFor="website">Instagram</label>
                    <Field
                      name="instagramHandle"
                      id="instagramHandle"
                      type="text"
                      placeholder="enter your intagram profile"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                    />
                    <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                      <ErrorMessage name="instagramHandle" />
                    </p>
                  </div>
                  <div className="mt-2 flex w-full flex-col">
                    <label htmlFor="twitter">Twitter</label>
                    <Field
                      name="twitterHandle"
                      id="twitterHandle"
                      type="text"
                      placeholder="enter your twitter handle"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                    />
                    <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                      <ErrorMessage name="twitterHandle" />
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loader}
                  className="mt-8 w-1/2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3"
                >
                  Submit
                </button>
              </Form>
            )
          }}
        </Formik>
      </div>)}
  </div>
}

export default CreatorPanel
