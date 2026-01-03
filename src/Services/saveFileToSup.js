import supabase from "../Config/supabase";

export const saveFileToSupabase = async (file, fileType) => {
  try {
    if (!file) {
      return { success: false, error: "No file selected" };
    }

    if (!fileType) {
      return { success: false, error: "No file type selected" };
    }

    // Generate unique filename to avoid overwrites
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileType}/${fileName}`;

    // Upload file to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from("portofolio")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file to Supabase:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("portofolio")
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error saving file to Supabase:", error);
    return { success: false, error: error.message };
  }
};
