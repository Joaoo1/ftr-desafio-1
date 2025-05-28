import Swal from "sweetalert2";

interface ModalProps {
	text: string;
	onConfirm: () => void;
}

export const showConfirmModal = ({ text, onConfirm }: ModalProps) => {
	Swal.fire({
		title: "Confirmar ação",
		text,
		icon: "question",
		showCancelButton: true,
		confirmButtonText: "Sim, confirmar!",
		confirmButtonColor: "#2c46b1",
		cancelButtonText: "Não!",
		confirmButtonAriaLabel: "Sim, confirmar!",
		cancelButtonAriaLabel: "Não",
	}).then(({ isConfirmed }) => {
		if (isConfirmed) {
			onConfirm();
		}
	});
};
