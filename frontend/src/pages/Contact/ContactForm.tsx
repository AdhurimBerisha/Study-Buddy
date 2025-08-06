import Button from "../../components/Button";

const ContactForm = () => {
  return (
    <form className="max-w-4xl w-full mx-auto mt-10 space-y-6">
      <div className="pb-3">
        <h1 className="text-6xl font-bold pb-10">
          Media and <br /> Business Inquiries
        </h1>
        <p className="font-thin">
          Send us a message below or email us at <br />
          <span className="underline">contact@info.com</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full">
          <label className="font-semibold text-sm mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="First"
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="font-semibold text-sm mb-1 invisible">Last</label>
          <input
            type="text"
            placeholder="Last"
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-sm mb-1 block">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
      </div>

      <div>
        <label className="font-semibold text-sm mb-1 block">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
      </div>

      <div className="pt-4">
        <Button className="px-8">Submit</Button>
      </div>
    </form>
  );
};

export default ContactForm;
