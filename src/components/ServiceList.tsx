import React, { useState, useCallback, useMemo, memo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Stack,
  Divider,
  FormControlLabel,
  Checkbox,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { getSerivcesByCenterId } from "../api/zenoti-api/services/zenotiService";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";

// ====== Types ======
type AddOn = {
  id: string;
  name: string;
  desc?: string;
  price: string;
};

type Service = {
  id: string;
  name: string;
  desc: string;
  price: string;
  duration: string;
  addOns?: AddOn[];
};

type Category = {
  id: string;
  title: string;
  services: Service[];
};

// ====== Style tokens ======
const BROWN = "#B89072";
const HEADER_BROWN = "#C2A489";
const BORDER = "#E6DFD8";
const TEXT_MUTED = "#6C757D";

// ====== Optimized Subcomponents ======

// Memoized ServiceRow to prevent unnecessary re-renders
const ServiceRow = memo(
  ({
    service,
    checked,
    onServiceToggle,
  }: {
    service: any;
    checked: boolean;
    onServiceToggle: () => void;
  }) => {
    console.log(service, "service in row");
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onServiceToggle}
            icon={<PanoramaFishEyeIcon sx={{ color: BROWN, opacity: 1.5 }} />}
            checkedIcon={<CheckCircleIcon sx={{ color: BROWN }} />}
            sx={{ p: 1.5 }}
          />
        }
        label={
          <RowLayout
            left={
              <>
                <Typography sx={{ fontWeight: 700, color: "#222" }}>
                  {service.name}
                </Typography>
                <Typography sx={{ fontSize: 14, color: TEXT_MUTED }}>
                  {service.description}
                </Typography>
              </>
            }
            right={
              <>
                <Typography sx={{ fontWeight: 700, color: "#222" }}>
                  ${service.price_info.final_price}
                </Typography>
                <Typography sx={{ fontSize: 14, color: TEXT_MUTED }}>
                  {service.duration} min
                </Typography>
              </>
            }
          />
        }
        sx={{
          m: 0,
          px: 2,
          py: 1.5,
          width: "100%",
          alignItems: "flex-start",
          "& .MuiFormControlLabel-label": { width: "100%" },
          bgcolor: checked ? "rgba(185,144,114,0.08)" : "transparent",
          "&:hover": { backgroundColor: "rgba(185,144,114,0.06)" },
        }}
      />
    );
  }
);

// Memoized RowLayout
const RowLayout = memo(
  ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        <Box>{left}</Box>
        <Box sx={{ textAlign: "right", minWidth: 108 }}>{right}</Box>
      </Stack>
    );
  }
);

// Memoized AddOnRow
const AddOnRow = memo(
  ({
    addOn,
    checked,
    onChange,
  }: {
    addOn: AddOn;
    checked: boolean;
    onChange: () => void;
  }) => {
    return (
      <Box
        sx={{
          py: 1,
          px: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Checkbox
            checked={checked}
            onChange={onChange}
            sx={{ pl: 1.5 }}
            icon={
              <CheckCircleOutlineIcon sx={{ color: BROWN, opacity: 0.5 }} />
            }
            checkedIcon={<CheckCircleIcon sx={{ color: BROWN }} />}
          />
          <Box>
            <Typography sx={{ fontWeight: 700, color: "#222" }}>
              {addOn.name}
            </Typography>
            {addOn.desc && (
              <Typography sx={{ fontSize: 14, color: TEXT_MUTED }}>
                {addOn.desc}
              </Typography>
            )}
          </Box>
        </Stack>

        <Typography
          sx={{
            fontWeight: 700,
            color: "#222",
            minWidth: 84,
            textAlign: "right",
          }}
        >
          {addOn.price}
        </Typography>
      </Box>
    );
  }
);

// Memoized AddOnBlock
const AddOnBlock = memo(
  ({
    parentName,
    serviceId,
    items,
    selectedIds,
    onToggle,
  }: {
    parentName: string;
    serviceId: string;
    items: AddOn[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
  }) => {
    return (
      <Box sx={{ pl: 4, pt: 1, pb: 1 }}>
        <Typography
          sx={{ fontSize: 14, color: BROWN, fontWeight: 600, mb: 0.5 }}
        >
          Add‑on Services ({parentName})
        </Typography>

        <Stack>
          {items.map((a, i) => (
            <React.Fragment key={a.id}>
              <AddOnRow
                addOn={a}
                checked={selectedIds.has(a.id)}
                onChange={() => onToggle(a.id)}
              />
              {i < items.length - 1 && <Divider sx={{ borderColor: BORDER }} />}
            </React.Fragment>
          ))}
        </Stack>
      </Box>
    );
  }
);

// Memoized SkeletonLoader
const SkeletonLoader = memo(() => (
  <Box sx={{ p: 2 }}>
    {[...Array(2)].map((_, i) => (
      <Box key={i} sx={{ mb: 2 }}>
        <Skeleton variant="text" height={32} sx={{ mb: 1, borderRadius: 1 }} />
        <Skeleton variant="text" width="60%" />
      </Box>
    ))}
  </Box>
));

// Optimized ServiceList component
const ServiceList = memo(
  ({
    services,
    selectedServiceIds,
    onToggleService,
    selectedAddOnsByService,
    toggleAddOn,
  }: {
    services: any[];
    selectedServiceIds: Set<string>;
    onToggleService: (serviceId: string) => void;
    selectedAddOnsByService: Record<string, Set<string>>;
    toggleAddOn: (serviceId: string, addOnId: string) => void;
  }) => {
    return (
      <Box sx={{ width: "100%" }}>
        {services.map((svc, idx) => {
          const checked = selectedServiceIds.has(svc.id);
          const showAddOns = checked && svc.addOns && svc.addOns.length > 0;

          return (
            <React.Fragment key={svc.id}>
              <ServiceRow
                service={svc}
                checked={checked}
                onServiceToggle={() => onToggleService(svc.id)}
              />

              {showAddOns && (
                <>
                  <Divider sx={{ mx: 2, borderColor: BORDER }} />
                  <AddOnBlock
                    parentName={svc.name}
                    serviceId={svc.id}
                    items={svc.addOns!}
                    selectedIds={
                      selectedAddOnsByService[svc.id] ?? new Set<string>()
                    }
                    onToggle={(id) => toggleAddOn(svc.id, id)}
                  />
                </>
              )}

              {idx < services.length - 1 && (
                <Divider sx={{ mx: 2, borderColor: BORDER }} />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    );
  }
);

// Memoized AccordionItem
const AccordionItem = memo(
  ({
    category,
    expanded,
    services,
    selectedServiceIds,
    onExpand,
    onToggleService,
    selectedAddOnsByService,
    toggleAddOn,
  }: {
    category: any;
    expanded: boolean;
    services: any[] | undefined;
    selectedServiceIds: Set<string>;
    onExpand: (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onToggleService: (serviceId: string) => void;
    selectedAddOnsByService: Record<string, Set<string>>;
    toggleAddOn: (serviceId: string, addOnId: string) => void;
  }) => {
    return (
      <Accordion
        expanded={expanded}
        onChange={onExpand}
        disableGutters
        square
        sx={{
          mb: 2,
          border: `1px solid ${BORDER}`,
          boxShadow: "none",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ color: expanded ? "#fff" : "black" }} />
          }
          sx={{
            bgcolor: expanded ? HEADER_BROWN : "white",
            color: expanded ? "#fff" : "black",
            "& .MuiAccordionSummary-content": { my: 0.5 },
            minHeight: 48,
          }}
        >
          <Typography sx={{ fontWeight: 700 }} component={"span"}>
            {category.name}{" "}
            <InfoOutlineIcon sx={{ fontSize: "17px", color: "#B89072" }} />
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          {!services ? (
            <SkeletonLoader />
          ) : services.length === 0 ? (
            <Box sx={{ p: 2, color: TEXT_MUTED }}>No services listed</Box>
          ) : (
            <ServiceList
              services={services}
              selectedServiceIds={selectedServiceIds}
              onToggleService={onToggleService}
              selectedAddOnsByService={selectedAddOnsByService}
              toggleAddOn={toggleAddOn}
            />
          )}
        </AccordionDetails>
      </Accordion>
    );
  }
);

// ====== Main optimized component ======
export default function ServiceAccordionList({
  center_id,
  categories,
  setSelectedServices,
}: {
  center_id: string;
  categories: any;
  setSelectedServices: (services: any) => void;
}) {
  // State management
  const [expanded, setExpanded] = useState<string | false>("");
  const [servicesByCategory, setServicesByCategory] = useState<
    Record<string, any[]>
  >({});

  // Changed to Set for multiple service selections per category
  const [selectedServicesByCategory, setSelectedServicesByCategory] = useState<
    Record<string, Set<string>>
  >({});

  const [selectedAddOnsByService, setSelectedAddOnsByService] = useState<
    Record<string, Set<string>>
  >({});

  console.log(selectedServicesByCategory, "selectedServicesByCategory");

  // Handle service toggle (now supports multiple selections)
  const handleToggleService = useCallback(
    (categoryId: string, serviceId: string) => {
      console.log({ categoryId, serviceId }, "toggling service");

      setSelectedServicesByCategory((prev) => {
        const currentSelected = new Set(prev[categoryId] ?? []);

        if (currentSelected.has(serviceId)) {
          // Remove service and its add-ons
          currentSelected.delete(serviceId);
          setSelectedAddOnsByService((prevAddOns) => {
            const { [serviceId]: removed, ...rest } = prevAddOns;
            return rest;
          });
        } else {
          // Add service
          currentSelected.add(serviceId);
        }

        return {
          ...prev,
          [categoryId]: currentSelected,
        };
      });
    },
    []
  );

  const toggleAddOn = useCallback((serviceId: string, addOnId: string) => {
    setSelectedAddOnsByService((prev) => {
      const current = new Set(prev[serviceId] ?? []);
      if (current.has(addOnId)) current.delete(addOnId);
      else current.add(addOnId);
      return { ...prev, [serviceId]: current };
    });
  }, []);

  const fetchServices = useCallback(
    async (center_id: string, categoryId: string) => {
      if (servicesByCategory[categoryId]) return;

      try {
        const response = await getSerivcesByCenterId(center_id, {
          category_id: categoryId,
        });
        console.log("Fetched services:", response);
        setServicesByCategory((prev) => ({
          ...prev,
          [categoryId]: response.services || [],
        }));
      } catch (error) {
        console.error("Error fetching services:", error);
        setServicesByCategory((prev) => ({
          ...prev,
          [categoryId]: [],
        }));
      }
    },
    [servicesByCategory]
  );

  const handleExpand = useCallback(
    (center_id: string, panel: string) =>
      (_e: React.SyntheticEvent, isExpanded: boolean) => {
        console.log("Expanding panel:", panel, isExpanded);
        if (isExpanded) {
          fetchServices(center_id, panel);
        }
        setExpanded(isExpanded ? panel : false);
      },
    [fetchServices]
  );

  // Helper functions
  const calculateTotalPrice = (payload: any) => {
    return payload.reduce(
      (total: any, category: any) =>
        total +
        category.services.reduce(
          (categoryTotal: any, service: any) =>
            categoryTotal + (service.serviceData?.price_info?.sale_price || 0),
          0
        ),
      0
    );
  };

  const formatPrice = (price: any) => `$${price}`;

  // **Enhanced selection object with complete service and add-on data**
  const getSelectionPayload = useMemo(() => {
    const result: Array<{
      categoryId: string;
      categoryName?: string;
      services: Array<{
        serviceId: string;
        serviceData: any;
        selectedAddOns: Array<{
          addOnId: string;
          addOnData: any;
        }>;
      }>;
    }> = [];

    Object.entries(selectedServicesByCategory).forEach(
      ([categoryId, serviceIds]) => {
        if (serviceIds.size === 0) return;

        const categoryServices = servicesByCategory[categoryId] || [];
        const category = categories?.find((cat: any) => cat.id === categoryId);

        const servicesData = Array.from(serviceIds)
          .map((serviceId) => {
            const serviceData = categoryServices.find(
              (svc) => svc.id === serviceId
            );
            const selectedAddOnIds =
              selectedAddOnsByService[serviceId] ?? new Set();

            const selectedAddOns = Array.from(selectedAddOnIds)
              .map((addOnId) => {
                const addOnData = serviceData?.addOns?.find(
                  (addon: any) => addon.id === addOnId
                );
                return {
                  addOnId,
                  addOnData,
                };
              })
              .filter((addon) => addon.addOnData); // Filter out any undefined add-ons

            return {
              serviceId,
              serviceData,
              selectedAddOns,
            };
          })
          .filter((service) => service.serviceData); // Filter out any undefined services

        if (servicesData.length > 0) {
          result.push({
            categoryId,
            categoryName: category?.name,
            services: servicesData,
          });
        }
      }
    );

    setSelectedServices(result); // Update parent component with the selection
    return result;
  }, [
    selectedServicesByCategory,
    selectedAddOnsByService,
    servicesByCategory,
    categories,
  ]);

  // Log the complete selection object for debugging
  console.log("Complete Selection Object:", getSelectionPayload);

  return (
    <Box sx={{ p: 2 }}>
      {categories?.map((cat: any) => {
        const services = servicesByCategory[cat.id];
        const selectedServiceIds =
          selectedServicesByCategory[cat.id] ?? new Set<string>();
        const isExpanded = expanded === cat.id;

        const onToggleService = (serviceId: string) => {
          handleToggleService(cat.id, serviceId);
        };

        return (
          <AccordionItem
            key={cat.id}
            category={cat}
            expanded={isExpanded}
            services={services}
            selectedServiceIds={selectedServiceIds}
            onExpand={handleExpand(center_id, cat.id)}
            onToggleService={onToggleService}
            selectedAddOnsByService={selectedAddOnsByService}
            toggleAddOn={toggleAddOn}
          />
        );
      })}
      {/* Display selection summary */}
      {getSelectionPayload.length > 0 && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            bgcolor: "rgba(185,144,114,0.08)",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: BROWN }}>
            Selected Services Summary:
          </Typography>
          {getSelectionPayload.map((category) => (
            <Box key={category.categoryId} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {category.categoryName}: {category.services.length} service(s)
              </Typography>
              {category.services.map((service) => (
                <Box
                  key={service.serviceId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    ml: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: TEXT_MUTED }}>
                    • {service.serviceData?.name}
                    {service.selectedAddOns.length > 0 &&
                      ` (+${service.selectedAddOns.length} add-on${
                        service.selectedAddOns.length > 1 ? "s" : ""
                      })`}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: BROWN,
                    }}
                  >
                    {formatPrice(
                      service.serviceData?.price_info?.sale_price || 0
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}

          {/* Total Price Section */}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${BROWN}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: BROWN,
              }}
            >
              Total:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: BROWN,
              }}
            >
              {formatPrice(calculateTotalPrice(getSelectionPayload))}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
