import Sidebar from './Sidebar';

export default function Page() {
  return (
    <div className="flex">
      <Sidebar activePath="/UserView" />
    </div>
  );
}
