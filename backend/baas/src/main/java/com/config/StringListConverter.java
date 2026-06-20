package com.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import tools.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.List;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null) return null;
        try {
            return MAPPER.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null) return Collections.emptyList();
        try {
            return MAPPER.readValue(
                dbData,
                MAPPER.getTypeFactory().constructCollectionType(List.class, String.class)
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
