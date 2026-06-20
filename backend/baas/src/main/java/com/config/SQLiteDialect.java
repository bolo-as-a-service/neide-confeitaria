package com.config;

import java.sql.Types;

import org.hibernate.boot.Metadata;
import org.hibernate.boot.model.relational.SqlStringGenerationContext;
import org.hibernate.dialect.DatabaseVersion;
import org.hibernate.dialect.Dialect;
import org.hibernate.dialect.identity.IdentityColumnSupport;
import org.hibernate.mapping.ForeignKey;
import org.hibernate.mapping.UniqueKey;
import org.hibernate.sql.ast.SqlAstTranslatorFactory;
import org.hibernate.sql.ast.spi.StandardSqlAstTranslatorFactory;
import org.hibernate.tool.schema.spi.Exporter;

public class SQLiteDialect extends Dialect {

    public SQLiteDialect() {
        super(DatabaseVersion.make(3, 45));
    }

    @Override
    public IdentityColumnSupport getIdentityColumnSupport() {
        return new SQLiteIdentityColumnSupport();
    }

    @Override
    protected String columnType(int sqlTypeCode) {
        switch (sqlTypeCode) {
            case Types.BIGINT:
            case Types.BIT:
            case Types.BOOLEAN:
                return "INTEGER";
            case Types.CLOB:
                return "TEXT";
            case Types.BLOB:
                return "BLOB";
            case Types.FLOAT:
            case Types.DOUBLE:
            case Types.DECIMAL:
            case Types.NUMERIC:
                return "REAL";
            default:
                return super.columnType(sqlTypeCode);
        }
    }

    @Override
    public SqlAstTranslatorFactory getSqlAstTranslatorFactory() {
        return new StandardSqlAstTranslatorFactory();
    }

    @Override
    public Exporter<ForeignKey> getForeignKeyExporter() {
        return NOOP_FK_EXPORTER;
    }

    @Override
    public Exporter<UniqueKey> getUniqueKeyExporter() {
        return NOOP_UNIQUE_KEY_EXPORTER;
    }

    private static final Exporter<ForeignKey> NOOP_FK_EXPORTER = new Exporter<>() {
        @Override
        public String[] getSqlCreateStrings(ForeignKey exportable, Metadata metadata, SqlStringGenerationContext context) {
            return Exporter.NO_COMMANDS;
        }

        @Override
        public String[] getSqlDropStrings(ForeignKey exportable, Metadata metadata, SqlStringGenerationContext context) {
            return Exporter.NO_COMMANDS;
        }
    };

    private static final Exporter<UniqueKey> NOOP_UNIQUE_KEY_EXPORTER = new Exporter<>() {
        @Override
        public String[] getSqlCreateStrings(UniqueKey exportable, Metadata metadata, SqlStringGenerationContext context) {
            return Exporter.NO_COMMANDS;
        }

        @Override
        public String[] getSqlDropStrings(UniqueKey exportable, Metadata metadata, SqlStringGenerationContext context) {
            return Exporter.NO_COMMANDS;
        }
    };
}
