import React, { useState, useCallback, useMemo, memo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Stack,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { getSerivcesByCenterId } from "../api/zenoti-api/services/zenotiService";

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
  ({ service, checked }: { service: any; checked: boolean }) => {
    console.log(service, "service in row");
    return (
      <FormControlLabel
        value={service.id}
        control={
          <Radio
            icon={<RadioButtonUncheckedIcon sx={{ color: BROWN }} />}
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
    categoryId,
    selectedServiceId,
    onSelectService,
    selectedAddOnsByService,
    toggleAddOn,
  }: {
    services: any[];
    categoryId: string;
    selectedServiceId: string | null;
    onSelectService: (event: any, value: string) => void;
    selectedAddOnsByService: Record<string, Set<string>>;
    toggleAddOn: (serviceId: string, addOnId: string) => void;
  }) => {
    return (
      <RadioGroup
        value={selectedServiceId ?? ""}
        onChange={onSelectService}
        sx={{ width: "100%" }}
      >
        {services.map((svc, idx) => {
          const checked = selectedServiceId === svc.id;
          const showAddOns = checked && svc.addOns && svc.addOns.length > 0;

          return (
            <React.Fragment key={svc.id}>
              <ServiceRow service={svc} checked={checked} />

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
      </RadioGroup>
    );
  }
);

// Memoized AccordionItem
const AccordionItem = memo(
  ({
    category,
    expanded,
    services,
    selectedServiceId,
    onExpand,
    onSelectService,
    selectedAddOnsByService,
    toggleAddOn,
  }: {
    category: any;
    expanded: boolean;
    services: any[] | undefined;
    selectedServiceId: string | null;
    onExpand: (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onSelectService: (event: any, value: string) => void;
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
              categoryId={category.id}
              selectedServiceId={selectedServiceId}
              onSelectService={onSelectService}
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
  categories,
}: {
  categories: any;
}) {
  // State management
  const [expanded, setExpanded] = useState<string | false>("");
  const [servicesByCategory, setServicesByCategory] = useState<
    Record<string, any[]>
  >({});
  const [selectedServiceByCategory, setSelectedServiceByCategory] = useState<
    Record<string, string | null>
  >({
    tox: "botox",
  });
  const [selectedAddOnsByService, setSelectedAddOnsByService] = useState<
    Record<string, Set<string>>
  >({
    botox: new Set(["chem-peel"]),
  });

  // Memoized callbacks
  const handleSelectService = useCallback(
    (categoryId: string, serviceId: string) => {
      setSelectedServiceByCategory((prev) => ({
        ...prev,
        [categoryId]: serviceId,
      }));
      setSelectedAddOnsByService((prev) => {
        const next = { ...prev };
        if (!next[serviceId]) next[serviceId] = new Set();
        return next;
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
    async (categoryId: string) => {
      if (servicesByCategory[categoryId]) return;

      try {
        const response = await getSerivcesByCenterId(
          "bea93d09-9abf-4ab4-b428-8f5246720654",
          {
            category_id: categoryId,
          }
        );
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
    (panel: string) => (_e: React.SyntheticEvent, isExpanded: boolean) => {
      console.log("Expanding panel:", panel, isExpanded);
      if (isExpanded) {
        fetchServices(panel);
      }
      setExpanded(isExpanded ? panel : false);
    },
    [fetchServices]
  );

  // Memoized selection payload
  const getSelectionPayload = useMemo(() => {
    return Object.entries(selectedServiceByCategory).map(
      ([categoryId, svcId]) => ({
        categoryId,
        serviceId: svcId,
        addOnIds: svcId ? Array.from(selectedAddOnsByService[svcId] ?? []) : [],
      })
    );
  }, [selectedServiceByCategory, selectedAddOnsByService]);

  console.log(servicesByCategory, "services by category");

  return (
    <Box sx={{ p: 2 }}>
      {categories?.map((cat: any) => {
        const services = servicesByCategory[cat.id];
        const selectedServiceId = selectedServiceByCategory[cat.id] ?? null;
        const isExpanded = expanded === cat.id;

        const onSelectService = (event: any, value: string) => {
          handleSelectService(cat.id, value);
        };

        return (
          <AccordionItem
            key={cat.id}
            category={cat}
            expanded={isExpanded}
            services={services}
            selectedServiceId={selectedServiceId}
            onExpand={handleExpand(cat.id)}
            onSelectService={onSelectService}
            selectedAddOnsByService={selectedAddOnsByService}
            toggleAddOn={toggleAddOn}
          />
        );
      })}
    </Box>
  );
}
