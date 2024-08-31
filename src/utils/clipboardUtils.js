import toast from 'react-hot-toast';

export function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text);
    toast.success(successMessage);
}