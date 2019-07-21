import { httpMethods } from "./httpMethods";
import { basicHeaders } from './httpHeaders';
import { basePaths } from "./urls";

export const getAllPatientRecords = (patientId) => {
    return {
        method: httpMethods.GET,
        headers: basicHeaders,
        path: `veggie-t-rex/patients/${patientId}/records`,
        basePath: basePaths.api,
    };
};