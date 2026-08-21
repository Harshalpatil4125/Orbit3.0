"use client";
import React, { useState } from "react";
import BreadCrumb from "../../../../components/Common/BreadCrumb";
import {
    Card,
    CardBody,
    Col,
    Container,
    Input,
    Label,
    Row,
    Spinner,
    FormFeedback,
    Button
} from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import PaginationTable from "./PaginationTable";
import Swal from "sweetalert2";

const ApplicationMaster = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [editId, setEditId] = useState<number | null>(null);

    const handleEdit = (item: any) => {
        setEditId(item.ApplicationId || item.applicationId);
        formik.setValues({
            application: item.Application || item.application || "",
        });
    };

    const formik = useFormik({
        initialValues: {
            application: "",
        },
        validationSchema: Yup.object({
            application: Yup.string()
                .required("Application is required")
                .max(100, "Application must be at most 100 characters"),
        }),

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const url = editId ? "/api/Marketing/Application/update" : "/api/Marketing/Application/insert";
                const method = "POST";
                const body = editId ? {
                    ApplicationId: editId,
                    Application: values.application
                } : {
                    Application: values.application
                };
                // Call backend API
                const response = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                const result = await response.json();

                if (result && result.success) {
                    Swal.fire({
                        title: editId ? "Updated!" : "Added!",
                        text: result.message || (editId ? "Application updated successfully!" : "Application added successfully!"),
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    resetForm();
                    setEditId(null);
                    setRefreshKey(prev => prev + 1);

                } else {
                    Swal.fire({ title: "Error!", text: result?.error || result?.message, icon: "error" });
                }

            } catch (error: any) {
                Swal.fire({ title: "Error!", text: error.message || "An error occurred.", icon: "error" });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Application" pageTitle="Master" />
                    <Row>
                        {/* Application Column */}
                        <Col lg={6}>
                            <Card>
                                <CardBody className="card-body mb-0">
                                    <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }} className="mb-4">
                                        <div className="mb-3">
                                            <Label htmlFor="applicationInput" className="form-label">
                                                Application<span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                id="applicationInput"
                                                placeholder="Enter Application"
                                                name="application"
                                                value={formik.values.application}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.application && formik.errors.application ? true : false}
                                                maxLength={100}
                                            />
                                            {formik.touched.application && formik.errors.application ? (
                                                <FormFeedback type="invalid">
                                                    {formik.errors.application}
                                                </FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button
                                                className="btn btn-soft-success"
                                                type="submit"
                                                disabled={formik.isSubmitting}
                                            >
                                                {formik.isSubmitting ? <Spinner size="sm" /> : "Save"}
                                            </Button>
                                            <Button
                                                className="btn btn-soft-danger"
                                                onClick={() => {
                                                    formik.resetForm();
                                                    setEditId(null);
                                                }}
                                                disabled={formik.isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>

                                    <div className="live-preview border-top pt-3">
                                        <PaginationTable
                                            key={refreshKey}
                                            setRefreshKey={setRefreshKey}
                                            onEdit={handleEdit}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default ApplicationMaster;
