import { useEffect } from "react";

type AdminModalProps = {
	closeModal: (e: React.MouseEvent<HTMLDivElement>) => void;
	modalRef: React.RefObject<HTMLDivElement | null>;
	modalHeader?: string;
	render: () => React.ReactNode;
}

function AdminModal(props: AdminModalProps) {
	const { closeModal, modalRef, modalHeader } = props;

	useEffect(() => {
		document.body.style.cssText= `
            position: fixed;
            top: -${window.scrollY}px;
            overflow-y: scroll;
            width: 100%;
        `;

		const handleMouseDown = (e: MouseEvent): void => {
			closeModal(e as unknown as React.MouseEvent<HTMLDivElement>);
		}

        document.addEventListener('mousedown', handleMouseDown);

		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
		}

    }, [closeModal]);

	return (
        <div className="modal-background">
            <div className="admin-modal-content" ref={modalRef}>
                <div className="modal-content-header">
                    <h1>{modalHeader}</h1>
                </div>
                <div className="modal-content-content">
                    {props.render()}
                </div>
            </div>
        </div>
    )
}

export default AdminModal;