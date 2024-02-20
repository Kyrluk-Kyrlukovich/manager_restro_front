import type {AxiosError} from "axios";

export function getServerError(error: AxiosError) {
    return error?.response?.data?.error?.message ?? error.message ?? "Произошла непредвиденная ошибка"
}