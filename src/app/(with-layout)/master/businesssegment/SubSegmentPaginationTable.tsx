"use client";
import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../components/Common/TableContainerReactTable";
import { Spinner } from "reactstrap";
import Swal from "sweetalert2";

interface SubSegmentPaginationTableProps {
    refreshTable: number;
    selectedSegmentId?: number | null;
    onEdit?: (item: any) => void;
    onAdd?: () => void;
}
/**
 * Child Component
 *
 * Responsibilities:
 *
 * ✔ Load Business Sub Segments
 * ✔ Filter by Business Segment   
 * ✔ Display Table
 * ✔ Delete Record
 * ✔ Search
 * ✔ Pagination
 */
const SubSegmentPaginationTable: React.FC<SubSegmentPaginationTableProps> = ({ refreshTable, selectedSegmentId, onEdit, onAdd }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch Data
     * Runs when component loads or when selectedSegmentId changes.
     */
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Marketing/BusinessSubSegment/get`);
            const result = await response.json();

            let fetchedData = [];
            if (result && result.success && Array.isArray(result.data)) {
                fetchedData = result.data;
            } else if (result && Array.isArray(result)) {
                fetchedData = result;
            }

            if (selectedSegmentId) {
                fetchedData = fetchedData.filter((item: any) =>
                    item.BusinessSegmentId === selectedSegmentId || item.businessSegmentId === selectedSegmentId
                );
            }

            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching Business Sub Segment:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };
    /**
     * useEffect
     *
     * Executes whenever:
     *
     * refreshTable changes
     *
     * OR
     *
     * selectedSegmentId changes.
     */
    useEffect(() => {
        if (selectedSegmentId) {
            fetchData();
        } else {
            setData([]);
        }
    }, [refreshTable, selectedSegmentId]);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Marketing/BusinessSubSegment/delete/${id}`, {
                    method: "DELETE",
                });
                const data = await response.json();

                if (data.success || response.ok) {
                    Swal.fire("Deleted!", "The sub segment has been deleted.", "success");
                    fetchData(); // Refresh the table
                } else {
                    Swal.fire("Error!", data.message || "Failed to delete sub segment.", "error");
                }
            } catch (error) {
                console.error("Delete Error:", error);
                Swal.fire("Error!", "An unexpected error occurred.", "error");
            }
        }
    };

    const columns = useMemo(
        () => [
            {
                header: "",
                accessorKey: "index",
                enableColumnFilter: false,
                cell: (cellProps: any) => {
                    return <div className="text-center text-muted">{cellProps.row.index + 1}</div>;
                }
            },
            {
                header: "Business Sub Segment",
                accessorKey: "BusinessSubSegment",
                enableColumnFilter: false,
                cell: (cell: any) => {
                    return <span className="text-muted" style={{ textDecoration: "none" }}>{cell.getValue()}</span>;
                }
            },
            {
                header: "Action",
                accessorKey: "actions",
                enableColumnFilter: false,
                cell: (cellProps: any) => {
                    const item = cellProps.row.original;
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
                                    handleDelete(item.BusinessSubSegmentId || item.businessSubSegmentId);
                                }}
                            >
                                <i className="ri-delete-bin-fill fs-5"></i>
                            </button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <React.Fragment>
            {loading ? (
                <div className="d-flex justify-content-center p-4">
                    <Spinner color="primary" />
                </div>
            ) : (
                <TableContainer
                    columns={(columns || []) as any}
                    data={(data || []) as any}
                    isGlobalFilter={true}
                    customPageSize={10}
                    divClass="table-responsive table-card mb-3"
                    tableClass="align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light text-center"
                    SearchPlaceholder="Search..."
                />
            )}
        </React.Fragment>
    );
};


export default SubSegmentPaginationTable;
