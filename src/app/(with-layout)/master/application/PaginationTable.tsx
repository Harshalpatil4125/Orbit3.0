"use client";
import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../components/Common/TableContainerReactTable";
import { Spinner } from "reactstrap";
import Swal from "sweetalert2";


interface PaginationTableProps {
    setRefreshKey?: React.Dispatch<React.SetStateAction<number>>;
    // Called when Edit button is clicked
    onEdit?: (item: any) => void;
}

const PaginationTable = ({ setRefreshKey, onEdit }: PaginationTableProps) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/Marketing/Application/get?t=${new Date().getTime()}`, { cache: 'no-store' });
                const result = await response.json();

                if (result && result.success && Array.isArray(result.data)) {
                    setData(result.data);
                } else if (result && Array.isArray(result)) {
                    setData(result);
                } else {
                    setData([]);
                }

            } catch (error) {
                console.error("Error fetching Application:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/Marketing/Application/delete/${id}`, {
                    method: "DELETE",
                });
                const resultData = await response.json();

                if (resultData && resultData.success) {
                    if (setRefreshKey) setRefreshKey(prev => prev + 1);
                    Swal.fire(
                        "Deleted!",
                        resultData.message || "Application has been deleted.",
                        "success"
                    );
                } else {
                    Swal.fire(
                        "Error!",
                        resultData?.message || "Failed to delete.",
                        "error"
                    );
                }
            } catch (error: any) {
                console.error("Delete error:", error);
                Swal.fire(
                    "Error!",
                    "Failed to delete.",
                    "error"
                );
            }
        }
    };

    const columns = useMemo(
        () => [
            {
                header: "",
                accessorKey: "serialNumber",
                enableColumnFilter: false,
                cell: (info: any) => info.row.index + 1,
            },
            {
                header: "Application",
                accessorKey: "Application",
                enableColumnFilter: false,
                cell: (cell: any) => {
                    const value = cell.getValue() || cell.row.original.application;
                    return (
                        <span
                            className="text-muted"
                            style={{ textDecoration: "none" }}
                        >
                            {value}
                        </span>
                    );
                }
            },
            {
                header: "Action",
                accessorKey: "actions",
                enableColumnFilter: false,
                cell: (cell: any) => {
                    const item = cell.row.original;
                    return (
                        <div className="d-flex gap-2 justify-content-center">
                            <button
                                title="Edit"
                                className="btn btn-soft-info rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: 30, height: 30 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit && onEdit(item);
                                }}
                            >
                                <i className="ri-pencil-fill fs-5"></i>
                            </button>

                            <button
                                title="Delete"
                                className="btn btn-soft-danger rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: 30, height: 30 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.ApplicationId || item.applicationId);
                                }}
                            >
                                <i className="ri-delete-bin-fill fs-5"></i>
                            </button>
                        </div>
                    );
                },
            },
        ],
        [onEdit, setRefreshKey]
    );

    return (
        <React.Fragment>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <TableContainer
                    columns={columns || []}
                    data={data || []}
                    isGlobalFilter={true}
                    customPageSize={10}
                    divClass="table-responsive table-card mb-3"
                    tableClass="table-centered align-middle table-nowrap mb-0 table-hover"
                    theadClass="text-muted table-light text-center"
                    SearchPlaceholder="Search:"
                />
            )}
        </React.Fragment>

    );
};

export default PaginationTable;
