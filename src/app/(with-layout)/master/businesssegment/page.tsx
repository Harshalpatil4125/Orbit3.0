"use client";
import React, { useState, useEffect } from "react";
import BreadCrumb from "../../../../components/Common/BreadCrumb";
// Reactstrap Bootstrap components used for UI.
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
import SubSegmentPaginationTable from "./SubSegmentPaginationTable";
import Swal from "sweetalert2";

const BusinessSegment = () => {
    const [selectedSegment, setSelectedSegment] = useState<any>(null);

    // --- Business Segment State ---
    const [refreshKey, setRefreshKey] = useState(0);
    const [editId, setEditId] = useState<number | null>(null);

    // --- Business Sub Segment State ---
    const [subRefreshKey, setSubRefreshKey] = useState(0);
    const [subEditId, setSubEditId] = useState<number | null>(null);

    const [businessSegments, setBusinessSegments] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/Marketing/BusinessSegment/get")
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setBusinessSegments(data.data);
                } else if (Array.isArray(data)) {
                    setBusinessSegments(data);
                }
            })
            .catch(console.error);
    }, [refreshKey]);

    // --- Business Segment Handlers ---
    const handleEdit = (item: any) => {
        setEditId(item.BusinessSegmentId || item.businessSegmentId);
        formik.setValues({
            businessSegment: item.BusinessSegment || item.businessSegment || "",
        });
    };

    const formik = useFormik({
        initialValues: {
            businessSegment: "",
        },
        validationSchema: Yup.object({
            businessSegment: Yup.string()
                .required("Business Segment is required")
                .max(100, "Business Segment must be at most 100 characters"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const url = editId ? "/api/Marketing/BusinessSegment/update" : "/api/Marketing/BusinessSegment/insert";
                const method = "POST";
                const body = editId ? {
                    BusinessSegmentId: editId,
                    BusinessSegment: values.businessSegment
                } : {
                    BusinessSegment: values.businessSegment
                };

                const response = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                const result = await response.json();

                if (result && result.success) {
                    Swal.fire({
                        title: editId ? "Updated!" : "Added!",
                        text: result.message || (editId ? "Business Segment updated successfully!" : "Business Segment added successfully!"),
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

    // --- Business Sub Segment Handlers ---
    const handleSubEdit = (item: any) => {
        setSubEditId(item.BusinessSubSegmentId || item.businessSubSegmentId);
        subFormik.setValues({
            businessSegmentId: item.BusinessSegmentId || item.businessSegmentId || "",
            businessSubSegment: item.BusinessSubSegment || item.businessSubSegment || "",
        });
    };

    const subFormik = useFormik({
        initialValues: {
            businessSegmentId: "",
            businessSubSegment: "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            businessSegmentId: Yup.string().required("Business Segment is required"),
            businessSubSegment: Yup.string()
                .required("Business Sub Segment is required")
                .max(100, "Business Sub Segment must be at most 100 characters"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const url = subEditId ? "/api/Marketing/BusinessSubSegment/update" : "/api/Marketing/BusinessSubSegment/insert";
                const method = "POST";
                const body = subEditId ? {
                    BusinessSubSegmentId: subEditId,
                    BusinessSegmentId: values.businessSegmentId,
                    BusinessSubSegment: values.businessSubSegment
                } : {
                    BusinessSegmentId: values.businessSegmentId,
                    BusinessSubSegment: values.businessSubSegment
                };

                const response = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                const result = await response.json();

                if (result && result.success) {
                    Swal.fire({
                        title: subEditId ? "Updated!" : "Added!",
                        text: result.message || (subEditId ? "Sub Segment updated successfully!" : "Sub Segment added successfully!"),
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    resetForm();
                    setSubEditId(null);
                    // Retain the prefilled segment ID
                    if (selectedSegment) {
                        subFormik.setFieldValue("businessSegmentId", selectedSegment.BusinessSegmentId || selectedSegment.businessSegmentId);
                    }
                    setSubRefreshKey(prev => prev + 1);
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

    // Automatically set the businessSegmentId in the Sub Segment form when a segment is selected
    useEffect(() => {
        if (selectedSegment && !subEditId) {
            subFormik.setFieldValue("businessSegmentId", selectedSegment.BusinessSegmentId || selectedSegment.businessSegmentId);
        }
    }, [selectedSegment, subEditId]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Business Segment" pageTitle="Master" />
                    <Row>
                        {/* Business Segment Column */}
                        <Col lg={6}>
                            <Card>
                                <CardBody className="card-body mb-0">
                                    <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }} className="mb-4">
                                        <div className="mb-3">
                                            <Label htmlFor="businessSegmentInput" className="form-label">
                                                Business Segment<span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                id="businessSegmentInput"
                                                placeholder="Enter Business Segment"
                                                name="businessSegment"
                                                value={formik.values.businessSegment}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.businessSegment && formik.errors.businessSegment ? true : false}
                                                maxLength={100}
                                            />
                                            {formik.touched.businessSegment && formik.errors.businessSegment ? (
                                                <FormFeedback type="invalid">
                                                    {formik.errors.businessSegment}
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
                                            onRowClick={(item) => setSelectedSegment(item)}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Business Sub Segment Column */}
                        {selectedSegment && (
                            <Col lg={6}>
                                <Card>
                                    <CardBody className="card-body mb-0">
                                        <form onSubmit={(e) => { e.preventDefault(); subFormik.handleSubmit(); }} className="mb-4">
                                            <div className="mb-3">
                                                <Label htmlFor="businessSegmentIdInput" className="form-label">
                                                    Business Segment<span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    type="select"
                                                    className="form-select"
                                                    id="businessSegmentIdInput"
                                                    name="businessSegmentId"
                                                    value={subFormik.values.businessSegmentId}
                                                    onChange={subFormik.handleChange}
                                                    onBlur={subFormik.handleBlur}
                                                    invalid={subFormik.touched.businessSegmentId && subFormik.errors.businessSegmentId ? true : false}
                                                    disabled // Users shouldn't change the segment when they are viewing a specific segment
                                                >
                                                    <option value="">Select Business Segment</option>
                                                    {businessSegments.map((segment, index) => (
                                                        <option key={index} value={segment.BusinessSegmentId || segment.businessSegmentId}>
                                                            {segment.BusinessSegment || segment.businessSegment}
                                                        </option>
                                                    ))}
                                                </Input>
                                                {subFormik.touched.businessSegmentId && subFormik.errors.businessSegmentId ? (
                                                    <FormFeedback type="invalid">
                                                        {subFormik.errors.businessSegmentId}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label htmlFor="businessSubSegmentInput" className="form-label">
                                                    Business Sub Segment<span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    id="businessSubSegmentInput"
                                                    placeholder="Enter Business Sub Segment"
                                                    name="businessSubSegment"
                                                    value={subFormik.values.businessSubSegment}
                                                    onChange={subFormik.handleChange}
                                                    onBlur={subFormik.handleBlur}
                                                    invalid={subFormik.touched.businessSubSegment && subFormik.errors.businessSubSegment ? true : false}
                                                    maxLength={100}
                                                />
                                                {subFormik.touched.businessSubSegment && subFormik.errors.businessSubSegment ? (
                                                    <FormFeedback type="invalid">
                                                        {subFormik.errors.businessSubSegment}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button
                                                    className="btn btn-soft-success"
                                                    type="submit"
                                                    disabled={subFormik.isSubmitting}
                                                >
                                                    {subFormik.isSubmitting ? <Spinner size="sm" /> : "Save"}
                                                </Button>
                                                <Button
                                                    className="btn btn-soft-danger"
                                                    onClick={() => {
                                                        subFormik.resetForm();
                                                        setSubEditId(null);
                                                        if (selectedSegment) {
                                                            subFormik.setFieldValue("businessSegmentId", selectedSegment.BusinessSegmentId || selectedSegment.businessSegmentId);
                                                        }
                                                    }}
                                                    disabled={subFormik.isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>

                                        <div className="live-preview border-top pt-3">
                                            <SubSegmentPaginationTable
                                                key={subRefreshKey}
                                                refreshTable={subRefreshKey}
                                                selectedSegmentId={selectedSegment.BusinessSegmentId || selectedSegment.businessSegmentId}
                                                onEdit={handleSubEdit}
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default BusinessSegment;
