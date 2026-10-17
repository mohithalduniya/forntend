import { fetchCategory } from "@/api/category.js";
import { fetchroom } from "@/api/room.js";
import Filter_section from "./Filter_section";

export default async function Store_Left_Section() {
  const categoryResponse = await fetchCategory();
  const roomResponse = await fetchroom();

  const category = categoryResponse?.category || [];
  const room = roomResponse?.data || [];


  return <Filter_section items={category} roomTypes={room} />;
}
