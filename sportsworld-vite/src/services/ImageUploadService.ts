import axios from "axios";
import type { IUploadResponse } from "../interfaces/IUploadResponse";

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
    const { data } = await axios({
      url: endpoint,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  } finally {
    formData.delete("file");
  }
};

export default { uploadVenueImage, uploadAthleteImage };
