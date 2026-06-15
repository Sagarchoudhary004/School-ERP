export default function MasterModal({
  title,
  children,
  footer,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {title}
        </h3>

        {children}

        {footer}
      </div>
    </div>
  );
}
