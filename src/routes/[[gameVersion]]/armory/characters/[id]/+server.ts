import { handleDirectCharacterSubmit, handleDirectEquipmentSubmit, handleDirectSpecializationSubmit } from "$lib/pages/character";

export const POST = async ({ request, params }) => {
  const body = await request.json();
  let new_character : boolean = false;
  if (body.character["id"] === undefined){
    new_character = true
  }
  

  const result_character : string = await handleDirectCharacterSubmit(body.character);
  const id = result_character.split("/")

  await handleDirectEquipmentSubmit(body.equipment, Number(id[id.length-1]), body.character.version);

  body.active_spec.id = Number(id[id.length-1])
  await handleDirectSpecializationSubmit(body.active_spec)

  body.off_spec.id = Number(id[id.length-1])
  await handleDirectSpecializationSubmit(body.off_spec)

  return new Response(JSON.stringify({ url: `/characters/${id[id.length-1]}`, new_character}), {
    headers: { 'Content-Type': 'application/json' }
  });
};