module com.timeplanners.timeplanner {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires org.kordamp.bootstrapfx.core;

    opens com.timeplanners.timeplanner to javafx.fxml;
    exports com.timeplanners.timeplanner;
}