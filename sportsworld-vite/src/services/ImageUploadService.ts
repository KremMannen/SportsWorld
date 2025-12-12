import axios from "axios";
import type { IUploadResponse } from "../interfaces/IServiceResponses";

const venueEndpoint = "http://localhost:5110/api/ImageUpload/venue";
const athleteEndpoint = "http://localhost:5110/api/ImageUpload/athlete";

const uploadVenueImage = async (image: File): Promise<IUploadResponse> => {
  return uploadImage(image, venueEndpoint);
};

const uploadAthleteImage = async (image: File): Promise<IUploadResponse> => {
  return uploadImage(image, athleteEndpoint);
};

// API svarer med filnavnet, som brukes til å generere filsti for visning
// av bildet senere
const uploadImage = async (
  image: File,
  endpoint: string
): Promise<IUploadResponse> => {
  const formData = new FormData();
  formData.append("file", image);

  try {
    const response = await axios({
      url: endpoint,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status !== 201) {
      return {
        success: false,
        fileName: null,
        error: "Failed to upload image.",
      };
    }
    return {
      success: true,
      fileName: response.data,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    return {
      success: false,
      fileName: null,
      error: "Failed to upload image.",
    };
  } finally {
    formData.delete("file");
  }
};

export default { uploadVenueImage, uploadAthleteImage };
