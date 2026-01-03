import supabase from "../Config/supabase";

export const saveFileToSupabase = async (file, fileType) => {
  try {
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState(null);

    if (!file) {
      setError("No file selected");
      return;
    }

    if (!fileType) {
      setError("No file type selected");
      return;
    }
    setUploading(true);
    setError(null);
    const { data, err } = await supabase.storage
      .from("portofolio")
      .upload(`${fileType}/${file.name}`, file);
    
    // get public url
    const { data: { publicUrl } } = supabase.storage
      .from("portofolio")
      .getPublicUrl(`${fileType}/${file.name}`);

    if (err) {
      setError(err.message);
      return;
    }
    setUploading(false);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error saving file to Supabase:", error);
    setUploading(false);
    setError(error.message);
    return { success: false, error: error.message };
  }
};
