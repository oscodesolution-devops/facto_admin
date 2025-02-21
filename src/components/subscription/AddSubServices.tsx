import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { SUBSERVICES } from "@/api/sub-services";
import { showError, showSucccess } from "@/utils/toast";
import { X } from "lucide-react";
interface DropdownOption {
  name: string;
  priceModifier: number;
  needsQuotation: boolean;
}

interface Request {
  name: string;
  inputType: "dropdown" | "checkbox";
  priceModifier: number;
  needsQuotation: boolean;
  options?: DropdownOption[];
}

interface Request {
  name: string;
  priceModifier: number;
  needsQuotation: boolean;
  inputType: "dropdown" | "checkbox";
  isMultipleSelect?: boolean;
  options?: DropdownOption[];
}

interface SubService {
  title: string;
  description: string;
  features: string[];
  price: number;
  period: "monthly" | "quarterly" | "half_yearly" | "yearly" | "one_time";
  isActive: boolean;
  requests: Request[];
}

interface AddSubServicesProps {
  isOpen: boolean;
  onClose: () => void;
  fetchSubServices: () => void;
  id: string;
  subServices?: any;
}

export function AddSubServices({ 
  isOpen, 
  onClose, 
  id, 
  fetchSubServices, 
  subServices 
}: AddSubServicesProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SubService>({
    title: "",
    description: "",
    features: [],
    price: 0,
    period: "monthly",
    isActive: true,
    requests: [],
  });

  const [featureInput, setFeatureInput] = useState<string>("");
  const [requestInput, setRequestInput] = useState<Request>({
    name: "",
    inputType: "checkbox",
    priceModifier: 0,
    needsQuotation: false,
    options: [],
  });

  const [optionInput, setOptionInput] = useState<DropdownOption>({
    name: "",
    priceModifier: 0,
    needsQuotation: false,
  });

  useEffect(() => {
    if (subServices) {
      setFormData({
        title: subServices.title || "",
        description: subServices.description || "",
        features: subServices.features || [],
        price: subServices.price || 0,
        period: subServices.period || "monthly",
        isActive: subServices.isActive ?? true,
        requests: subServices.requests || [],
      });
      setIsEdit(true);
    } else {
      resetForm();
    }
  }, [subServices]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      features: [],
      price: 0,
      period: "monthly",
      isActive: true,
      requests: [],
    });
    setIsEdit(false);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleFeatureAdd = () => {
    if (featureInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleFeatureRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleRequestInputChange = (name: string, value: any) => {
    setRequestInput((prev) => ({
      ...prev,
      [name]: value,
      // Reset options when switching from dropdown to checkbox
      ...(name === 'inputType' && value === 'checkbox' ? { options: [] } : {}),
    }));
  };


  const handleOptionInputChange = (name: string, value: any) => {
    setOptionInput((prev) => ({
      ...prev,
      [name]: name === "priceModifier" ? parseFloat(value) : value,
    }));
  };

  const handleOptionAdd = () => {
    if (optionInput.name.trim() !== "") {
      setRequestInput((prev) => ({
        ...prev,
        options: [...(prev.options || []), optionInput],
      }));
      setOptionInput({ 
        name: "",
        priceModifier: 0,
        needsQuotation: false
      });
    }
  };

  const handleOptionRemove = (index: number) => {
    setRequestInput((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  const handleRequestAdd = () => {
    if (requestInput.name.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        requests: [...prev.requests, requestInput],
      }));
      setRequestInput({
        name: "",
        inputType: "checkbox",
        priceModifier: 0,
        needsQuotation: false,
        options: [],
      });
    }
  };

  const handleRequestRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requests: prev.requests.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SUBSERVICES.PostSubService(id, formData);
      fetchSubServices();
      onClose();
      showSucccess("Sub-service successfully created");
    } catch (error: any) {
      console.error("Error creating sub-service:", error);
      showError(error.response?.data?.message || "Error creating sub-service");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!subServices?._id) {
      showError("Sub-service ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await SUBSERVICES.UpdateSubService({
        _id: subServices._id,
        ...formData
      });

      if (response.success) {
        handleCloseModal();
        fetchSubServices();
        showSucccess(response.message || "Sub-service updated successfully");
      } else {
        showError(response.message || "Failed to update sub-service");
      }
    } catch (error: any) {
      console.error("Error during edit:", error);
      showError(error.response?.data?.message || "An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="rounded-md font-outfit max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-inter">
              {isEdit ? "Edit Sub Service" : "Add New Sub Service"}
            </DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4 border border-gray-300 p-5 rounded-md"
            onSubmit={isEdit ? handleEditSubmit : handleSubmit}
          >
            <ScrollArea className="h-[500px] p-2">
            <div className="flex flex-col p-2 space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Sub Service Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Service Title"
                className="rounded-md"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col p-2 space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add description"
                className="rounded-md resize-none"
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col p-2 space-y-2">
              <label htmlFor="features" className="text-sm font-medium">
                Features
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="features"
                  placeholder="Add feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="rounded-md"
                />
                <Button 
                  type="button" 
                  onClick={handleFeatureAdd}
                  disabled={!featureInput.trim()}
                >
                  Add
                </Button>
              </div>
              <ul className="list-disc pl-5">
                {formData.features.map((feature, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{feature}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleFeatureRemove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col p-2 space-y-2">
              <label htmlFor="requests" className="text-sm font-medium">
                Service Requests
              </label>
              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <Input
                    id="request-name"
                    name="name"
                    placeholder="Request Name"
                    value={requestInput.name}
                    onChange={(e) => handleRequestInputChange("name", e.target.value)}
                    className="rounded-md"
                  />
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Input Type</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Checkbox</span>
                      <Switch
                        checked={requestInput.inputType === "dropdown"}
                        onCheckedChange={(checked) => 
                          handleRequestInputChange("inputType", checked ? "dropdown" : "checkbox")
                        }
                      />
                      <span className="text-sm">Dropdown</span>
                    </div>
                  </div>

                  {requestInput.inputType === "checkbox" && (
                    <>
                      <Input
                        id="price-modifier"
                        name="priceModifier"
                        placeholder="Price Modifier"
                        type="number"
                        value={requestInput.priceModifier}
                        onChange={(e) => handleRequestInputChange("priceModifier", parseFloat(e.target.value))}
                        className="rounded-md"
                      />
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Needs Quotation</label>
                        <Switch
                          checked={requestInput.needsQuotation}
                          onCheckedChange={(checked) => 
                            handleRequestInputChange("needsQuotation", checked)
                          }
                        />
                      </div>
                    </>
                  )}
                </div>

                {requestInput.inputType === "dropdown" && (
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-2">
                      <Input
                        id="option-name"
                        name="name"
                        placeholder="Option Name"
                        value={optionInput.name}
                        onChange={(e) => handleOptionInputChange("name", e.target.value)}
                        className="rounded-md"
                      />
                      <Input
                        id="option-price-modifier"
                        name="priceModifier"
                        placeholder="Option Price Modifier"
                        type="number"
                        value={optionInput.priceModifier}
                        onChange={(e) => handleOptionInputChange("priceModifier", e.target.value)}
                        className="rounded-md"
                      />
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Option Needs Quotation</label>
                        <Switch
                          checked={optionInput.needsQuotation}
                          onCheckedChange={(checked) => 
                            handleOptionInputChange("needsQuotation", checked)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleOptionAdd}
                        disabled={!optionInput.name.trim()}
                        className="mt-2"
                      >
                        Add Option
                      </Button>
                    </div>
                    <ul className="list-disc pl-5">
                      {requestInput.options?.map((option, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{option.name}</span>
                            <span className="ml-2">{`(Price Modifier: ${option.priceModifier})`}</span>
                            <span className="ml-2 text-sm text-gray-600">
                              {option.needsQuotation ? "(Needs Quotation)" : ""}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOptionRemove(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleRequestAdd}
                  disabled={!requestInput.name.trim() || (requestInput.inputType === "dropdown" && (!requestInput.options || requestInput.options.length === 0))}
                  className="w-full"
                >
                  Add Request
                </Button>
              </div>

              <ul className="list-disc pl-5 space-y-2 mt-4">
                {formData.requests.map((request, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div className="w-full">
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-gray-600">
                        {`Type: ${request.inputType}`}
                        {request.inputType === 'checkbox' && 
                          `, Price Modifier: ${request.priceModifier}, Quotation: ${request.needsQuotation ? "Yes" : "No"}`
                        }
                      </p>
                      {request.inputType === 'dropdown' && request.options && request.options.length > 0 && (
                        <div className="ml-4 text-sm text-gray-500">
                          <p>Options:</p>
                          <ul className="list-disc ml-4">
                            {request.options.map((option, idx) => (
                              <li key={idx}>
                                {`${option.name} - Price Modifier: ${option.priceModifier}${option.needsQuotation ? " (Needs Quotation)" : ""}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRequestRemove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col p-2 space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleInputChange}
                className="rounded-md"
                required
              />
            </div>

            {/* Period Dropdown */}
            <div className="flex flex-col p-2 space-y-2">
              <label htmlFor="period" className="text-sm font-medium">
                Billing Period
              </label>
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                className="rounded-md border p-2"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half_yearly">Half-Yearly</option>
                <option value="yearly">Yearly</option>
                <option value="one_time">One-Time</option>
              </select>
            </div>
          </ScrollArea>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : isEdit ? "Update Sub Service" : "Create Sub Service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}