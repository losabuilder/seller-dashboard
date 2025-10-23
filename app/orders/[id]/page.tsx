type tParams = Promise<{ id: string }>;

export default async function Order({ params }: { params: tParams }) {
  const { id } = await params;

  return (
    <div>
      <h1>Order {id}</h1>
    </div>
  );
}
