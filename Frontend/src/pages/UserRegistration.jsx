import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const API_BASE = "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  // Dropdown state
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPanchayath, setSelectedPanchayath] = useState("");

  // Options from backend
  const [districts, setDistricts] = useState([]);
  const [panchayaths, setPanchayaths] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch all member-registered districts on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/registration/available-user-locations`);
        setDistricts(data.districts || []);
      } catch (e) {
        console.error("Failed to load districts", e);
        setDistricts([]);
      }
    })();
  }, []);

  // Fetch available panchayaths (for selected district)
  useEffect(() => {
    const dist = (selectedDistrict || "").trim();
    if (!dist) {
      setPanchayaths([]);
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/registration/available-user-locations`, {
          params: { district: dist },
        });
        setPanchayaths(data.panchayaths || []);
      } catch (e) {
        setPanchayaths([]);
      }
    })();
  }, [selectedDistrict]);

  // Fetch available wardNos (for selected district+panchayath)
  useEffect(() => {
    const dist = (selectedDistrict || "").trim();
    const pan = (selectedPanchayath || "").trim();
    if (!dist || !pan) {
      setWards([]);
      return;
    }
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/registration/available-user-locations`, {
          params: { district: dist, panchayath: pan },
        });
        setWards(data.wardNos || []);
      } catch (e) {
        setWards([]);
      }
    })();
  }, [selectedDistrict, selectedPanchayath]);

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Full name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
    district: Yup.string().required("District is required"),
    panchayath: Yup.string().required("Panchayath is required"),
    wardNo: Yup.string().required("Ward No is required"),
  });

  // Submit handler
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const userRes = await axios.post(`${API_BASE}/registration/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        district: values.district.trim(),
        panchayath: values.panchayath.trim(),
        wardNo: values.wardNo.trim(),
      });

      const token = userRes.data.token;
      localStorage.setItem("token", token);
      navigate("/login");
    } catch (error) {
      setErrors({ api: error.response?.data?.message || "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 px-4 py-10 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-1/3 -right-10 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-xl md:max-w-2xl bg-white rounded-2xl shadow-xl border border-green-100">
        <div className="px-6 sm:px-10 py-8 sm:py-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
            Create an Account
          </h2>
          <p className="text-gray-600 text-center mt-2 mb-8">
            Join Panchayath Connect to report and track community issues
          </p>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              district: "",
              panchayath: "",
              wardNo: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ isSubmitting, errors, values, setFieldValue }) => (
              <Form className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1">Full Name</label>
                  <Field
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-900 placeholder-gray-400 bg-white"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1">Email</label>
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-900 placeholder-gray-400 bg-white"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* District */}
                <div>
                  <label htmlFor="district" className="block text-sm font-semibold text-gray-900 mb-1">District</label>
                  <Field
                    as="select"
                    id="district"
                    name="district"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-900 bg-white"
                    value={values.district}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFieldValue("district", v);
                      setSelectedDistrict(v);
                      setFieldValue("panchayath", "");
                      setSelectedPanchayath("");
                      setFieldValue("wardNo", "");
                    }}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="district" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Panchayath */}
                <div>
                  <label htmlFor="panchayath" className="block text-sm font-semibold text-gray-900 mb-1">Panchayath</label>
                  <Field
                    as="select"
                    id="panchayath"
                    name="panchayath"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-900 bg-white"
                    value={values.panchayath}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFieldValue("panchayath", v);
                      setSelectedPanchayath(v);
                      setFieldValue("wardNo", "");
                    }}
                    disabled={!values.district}
                  >
                    <option value="">Select Panchayath</option>
                    {panchayaths.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="panchayath" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Ward No */}
                <div>
                  <label htmlFor="wardNo" className="block text-sm font-semibold text-gray-900 mb-1">Ward No</label>
                  <Field
                    as="select"
                    id="wardNo"
                    name="wardNo"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-900 bg-white"
                    value={values.wardNo}
                    onChange={(e) => setFieldValue("wardNo", e.target.value)}
                    disabled={!selectedPanchayath}
                  >
                    <option value="">Select Ward No</option>
                    {wards.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="wardNo" component="div" className="text-red-600 text-sm mt-1" />
                  {selectedPanchayath && wards.length === 0 && (
                    <div className="text-xs text-gray-500 mt-1">No wards found for the selected panchayath.</div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1">Password</label>
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-900 placeholder-gray-400 bg-white"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-1">Confirm Password</label>
                  <Field
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-900 placeholder-gray-400 bg-white"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* API Error */}
                {errors.api && (
                  <div className="text-red-600 text-center text-sm">{errors.api}</div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-white font-bold bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>

                {/* Footer text */}
                <p className="text-center text-sm text-gray-700">
                  Already have an account? <span onClick={() => navigate('/login')} className="text-green-700 font-semibold cursor-pointer hover:underline">Login</span>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
